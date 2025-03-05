import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

const queryKey = ["GetServices"];
export const useAddServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return api.post(`services`, data).then((res) => res.data);
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return api.delete(`services/${id}`).then((res) => res.data);
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useUpdateService = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) =>
      await api.patch(`/services/` + id, data).then((res) => res.data),
    onSuccess: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
    },
  });
};
