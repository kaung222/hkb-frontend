import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      return await api.post("users", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetUsers"] });
    },
  });
};
