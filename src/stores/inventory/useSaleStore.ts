import { create } from "zustand";

interface Sale {
  id: string;
  date: string;
  branch: string;
  voucher: string;
  itemCode: string[];
  itemName: string[];
  lot: string[];
  user: string;
  customer: string;
  payment: string;
  qty: number[];
  amount: number[];
  discount: number[];
  tax: number[];
  paid: number[];
  total: number[];
  remain: number[];
  damage: number[];
}

interface SaleState {
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  multiSale: Partial<Sale>;
  setMultiSale: (multiSale: Partial<Sale>) => void;
  saleDetail: Partial<Sale>;
  setSaleDetail: (saleDetail: Partial<Sale>) => void;
}

const useSaleStore = create<SaleState>((set) => ({
  sales: [],
  setSales: (sales) => set({ sales }),
  multiSale: {
    itemCode: [],
    itemName: [],
    lot: [],
    qty: [],
    amount: [],
    discount: [],
    tax: [],
    paid: [],
    total: [],
    remain: [],
  },
  setMultiSale: (multiSale) => set({ multiSale }),
  saleDetail: {},
  setSaleDetail: (saleDetail) => set({ saleDetail }),
}));

export default useSaleStore;
