import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

interface CashDetail {
  id: number;
  generalExpense?: number;
  adjust?: number;
}

interface DebtDetail {
  id: number;
  payyan: number;
  yayan: number;
  paid?: string;
}

export const useCashMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cashDetail: CashDetail) => {
      await api.post(`/api/hkb.php?op=cash`, cashDetail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cash"]
      });
    },
  });
};

export const useDebtMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (debtDetail: DebtDetail) => {
      await api.post(`/api/hkb.php?op=debt`, debtDetail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["debt"]
      });
    },
  });
};
