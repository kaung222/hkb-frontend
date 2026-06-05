export type ExpenseItem = {
  name: string;
  price: number;
};

export type Expense = {
  id: number;
  name: string;
  amount: number;
  notes?: string;
  items?: ExpenseItem[];
  date: string;
  branchId: number;
  branch?: {
    id: number;
    name: string;
  };
};

export type ExpensesResponse = {
  data: Expense[];
  totalAmount: number;
  total: number;
  page: number;
  startDate: string;
  endDate: string;
};
