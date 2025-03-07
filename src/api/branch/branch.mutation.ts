import { Branch } from "@/types/branch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const useCreateBranch = () => {
  return useMutation({
    mutationFn: async (payload: Partial<Branch>) => {
      return await api.post("branches", payload).then((res) => res.data);
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string }) => {
      return await api.delete(`/branches/${payload.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBranches"] });
    },
  });
};

export const useUpdateBranch = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      return await api.patch(`/branches/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBranches"] });
    },
  });
};
