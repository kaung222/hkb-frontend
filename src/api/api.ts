import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
});

console.log(baseURL);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any = [];

// Function to handle the queue of requests during refresh
const processQueue = (error: Error | null, token = null) => {
  failedQueue.forEach((promise: any) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the error is 401 and the request was not retried
    if (
      error.response?.status == 401 &&
      error.response?.data?.message == "jwt expired"
    ) {
      localStorage.clear();
      return history.pushState({}, "", "/login");
    }
    if (
      error.response?.status === 401 &&
      error.response?.data?.message == "jwt expired" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue requests while refresh is ongoing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
    }

    return Promise.reject(error);
  }
);

export default api;
