export type Expense = {
  id: number;
  name: string;
  amount: number;
  notes?: string;
  category?: string;
  date: string;
  branchId: number;
  branch?: {
    id: number;
    name: string;
  };
};
