import { useQuery } from "@tanstack/react-query";
import api from "../api";
interface GetServiceProps {
  queryKey: any;
  filterDate: any;
}
export const useGetServiceQuery = () => {
  const startDate = new Date("2025-03-01");
  const endDate = new Date("2025-03-5");

  return useQuery({
    queryKey: ["GetServices", startDate, endDate],
    queryFn: async () => {
      return api
        .get(`/services/by/retrived-date`, {
          params: {
            startDate,
            endDate,
          },
        })
        .then((res) => res.data);
    },
  });
};
