import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/users/${id}`).then((res) => res.data);
    },
    onSuccess: () => {
      toast("User deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["GetUsers"],
      });
    },
  });
};
