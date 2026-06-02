import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { Customer, CustomersResponse } from "@/types/customer";

export const useGetCustomers = (filters: {
  branchId?: number;
  page?: number;
}) => {
  return useQuery<CustomersResponse>({
    queryKey: ["GetCustomers", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.branchId !== undefined) {
        params.append("branchId", filters.branchId.toString());
      }
      const page = filters.page || 1;
      params.append("page", page.toString());

      const queryString = params.toString();
      const url = queryString ? `customers?${queryString}` : "customers";

      return await api.get(url).then((res) => res.data);
    },
    enabled: !!filters.branchId,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
