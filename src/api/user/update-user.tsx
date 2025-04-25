import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { toast } from "sonner";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return await api
        .patch(`/users/${payload.id}`, payload)
        .then((res) => res.data);
    },
    onSuccess: () => {
      toast("User updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["GetUsers"],
      });
    },
  });
};
