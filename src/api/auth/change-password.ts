import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { PasswordChangePayload } from "@/components/Settings/schema";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: PasswordChangePayload) => {
      return await api
        .patch("users/info/change-password", payload)
        .then((res) => res.data);
    },
  });
};
