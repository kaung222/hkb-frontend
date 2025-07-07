export type Item = {
  id?: number;

  name: string;

  price: number;

  quantity: number;

  total: number;

  note: string;

  serviceId?: number;

  branchId: number;

  createdAt?: Date;
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
