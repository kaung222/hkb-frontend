// CashItem.ts
export interface CashItem {
  id: number;
  service: number;
  sale: number;
  purchase: number;
  generalExpense: number;
  adjust: number;
  payyan: number;
  yayan: number;
  date: string;
  gg: string;
  branch: string;
}

// DebtItem.ts
export interface DebtItem {
  id: number;
  debtId: number;
  name: string;
  payyan: number;
  yayan: number;
  branch: string;
  description: string;
  voucher: string;
  date: string;
  paid: string;
}

export type FilterDate =
  | "today"
  | "tweek"
  | "tmonth"
  | "tyear"
  | "pweek"
  | "pmonth"
  | "pyear"
  | "all"
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";

export type SortByItem =
  | "date"
  | "sale"
  | "purchase"
  | "generalExpense"
  | "adjust";

export interface CashBookState {
  loading: boolean;
  filterDate: FilterDate;
  cash: CashItem[];
  cashDetail: Partial<CashItem>;
  refresh: boolean;
  addCash: boolean;
  debtDetail: Partial<DebtItem>;
  creditList: boolean;
  debt: DebtItem[];
  sortByItem: SortByItem;
  branch: string;
  editableGE: boolean;
  editableAdj: boolean;
}
