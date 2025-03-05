export type Item = {
  id: string;
  branch: string;
  itemCode: string;
  itemName: string;
  lot: string;
  category: string;
  purchasePrice: number;
  sellPrice: number;
  user: string;
  date: string;
  note: string;
};

export type Sale = {
  id: string;
  date: string;
  branch: string;
  voucher: string;
  itemCode: string;
  itemName: string;
  lot: string;
  user: string;
  customer: string;
  payment: string;
  qty: number;
  amount: number;
  discount: number;
  tax: number;
  paid: number;
  total: number;
  remain: number;
  damage: number;
};
