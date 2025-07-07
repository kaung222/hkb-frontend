import api from "@/api/api";
import { Item } from "@/types/inventory";
import { useMutation } from "@tanstack/react-query";

export const useDeleteItem = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/items/${id}`);
    },
  });
};

export const useCreateItem = () => {
  return useMutation({
    mutationFn: async (item: Item) => {
      return await api.post(`/items`, item);
    },
  });
};
export const useUpdateItem = () => {
  return useMutation({
    mutationFn: async (item: Item) => {
      return await api.put(`/items/${item.id}`, item);
    },
  });
};
