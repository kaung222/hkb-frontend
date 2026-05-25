import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { Customer } from "@/types/customer";

export const useGetCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ["GetCustomers"],
    queryFn: async () => {
      return await api.get("customers").then((res) => res.data);
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
