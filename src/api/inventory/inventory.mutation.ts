import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

interface SaveItemPayload {
  branch: string[];
  user: string;
  itemCode: string;
  itemName: string;
  lot: string;
  category: string;
  purchasePrice: number;
  sellPrice: number;
  note: string;
}
export const useSaveItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveItemPayload>({
    mutationFn: async (newItem) => {
      return await api
        .post(`/api/hkb.php?op=saveItem`, newItem)
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
    },
  });
};

interface SaveSalePayload {
  id?: number; // Optional for update/delete
  user?: string;
  itemCode?: string;
  itemName?: string;
  lot?: string;
  customer?: string;
  voucher?: string;
  amount?: number;
  discount?: number;
  tax?: number;
  paid?: number;
  total?: number;
  remain?: number;
  damage?: number;
  qty?: number;
  branch?: string;
  delete?: boolean; // Indicates delete operation
  pdate?: string; // Previous date for update/delete
  ppaid?: number; // Previous paid for update/delete
  pdamage?: number; // Previous damage for update
  pqty?: number; // Previous quantity for update
}

export const useSaveSaleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveSalePayload>({
    mutationFn: async (newSale) => {
      return await api
        .post(`/api/hkb.php?op=sale`, newSale)
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
};

interface MultiSalePayload {
  voucher: string;
  branch: string;
  user: string;
  customer?: string;
  payment?: string;
  itemCode: string[];
  itemName: string[];
  amount: number[];
  qty: number[];
  tax: number[];
  discount: number[];
  total: number[];
  remain: number[];
}

export const useSaveMultiSaleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MultiSalePayload>({
    mutationFn: async (multiSale) => {
      return await api
        .post(`/api/hkb.php?op=multi_sale`, multiSale)
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
    onError: (error) => {
      console.error("MultiSale Error:", error.message);
    },
  });
};
