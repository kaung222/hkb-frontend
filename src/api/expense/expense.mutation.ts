import { Expense } from "@/types/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Expense>) => {
      return await api.post("expenses", payload).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetExpenses"] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string }) => {
      return await api.delete(`/expenses/${payload.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetExpenses"] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  type Payload = {
    id: string;
    payload: Partial<Expense>;
  };
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await api.patch(`/expenses/${payload.id}`, payload.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetExpenses"] });
    },
  });
};
