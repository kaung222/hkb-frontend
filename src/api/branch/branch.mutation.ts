import { Branch } from "@/types/branch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Branch>) => {
      return await api.post("branches", payload).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBranches"] });
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

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  type Payload = {
    id: string;
    payload: Partial<Branch>;
  };
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await api.patch(`/branches/${payload.id}`, payload.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetBranches"] });
    },
  });
};
