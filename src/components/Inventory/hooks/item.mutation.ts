import api from "@/api/api";

import { Item } from "@/types/inventory";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/items/${id}`);
    },
    onSuccess: () => {
      // invalidate all queries
      queryClient.invalidateQueries({ queryKey: ["items"], exact: false });
    },
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Item) => {
      return await api.post(`/items`, item);
    },
    onSuccess: () => {
      // invalidate all queries
      queryClient.invalidateQueries({ queryKey: ["items"], exact: false });
    },
  });
};
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Item) => {
      return await api.patch(`/items/${item.id}`, item);
    },
    onSuccess: () => {
      // invalidate all queries
      queryClient.invalidateQueries({ queryKey: ["items"], exact: false });
    },
  });
};
