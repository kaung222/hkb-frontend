import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { Expense, ExpensesResponse } from "@/types/expense";

export const useGetExpenses = (filters: {
  branchId: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
}) => {
  return useQuery<ExpensesResponse>({
    queryKey: ["GetExpenses", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.branchId) {
        params.append("branchId", filters.branchId.toString());
      }

      if (filters?.category) {
        params.append("category", filters.category);
      }

      if (filters?.startDate) {
        params.append("startDate", filters.startDate);
      }

      if (filters?.endDate) {
        params.append("endDate", filters.endDate);
      }

      if (filters?.page) {
        params.append("page", filters.page.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `expenses?${queryString}` : "expenses";

      return await api.get(url).then((res) => res.data);
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
