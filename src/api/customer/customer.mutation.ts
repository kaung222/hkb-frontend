import { Customer } from "@/types/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Customer>) => {
      return await api.post("customers", payload).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCustomers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string }) => {
      return await api.delete(`/customers/${payload.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCustomers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  type Payload = {
    id: string;
    payload: Partial<Customer>;
  };
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await api.patch(`/customers/${payload.id}`, payload.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetCustomers"] });
    },
  });
};
