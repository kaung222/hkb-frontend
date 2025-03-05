import { useQuery } from "@tanstack/react-query";
import api from "../api";

interface GetCashProps {
  queryKey: any;
  filterDate: string;
  branch: string;
}

interface GetDebtProps {
  queryKey: any;
  filterDate: string;
  branch?: string;
}

export const useGetCashQuery = ({ queryKey, filterDate,  }: GetCashProps) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await api.post(`/api/hkb.php?op=getcash`, {
        filterDate,
        // branch,
      });
      return response.data[0]?.cashBook || [];
    },
  });
};

export const useGetDebtQuery = ({ queryKey, filterDate, branch }: GetDebtProps) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await api.post(`/api/hkb.php?op=getDebt`, {
        filterDate,
        branch,
      });
      return response.data[0]?.Debt || [];
    },
  });
};
