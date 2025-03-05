// export type Service = {
//   branch: number;
//   user: string;
//   date: string;
//   brand: string;
//   color: string;
//   condition: string;
//   customer: string;
//   due_date: string;
//   engineer: string;
//   error: string;
//   expense: string;
//   id: string;
//   imei: string;
//   item: string;
//   model: string;
//   paid: string;
//   phone: string;
//   profit: string;
//   progress: string;
//   remain: string;
//   remark: string;
//   return_date: string;
//   serviceRetrun : string
//   service_charges: string;
//   service_reply: string;
//   service_return: string;
//   voucher: string;
//   warranty: string;
//   is_retrieved: string;
//   retrieved_date: string;
// };

export enum Status {
  RETRIEVED = "retrieved",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENNDING = "pending",
}

export type Service = {
  id: number; // assuming BaseEntity provides this field
  branchId: number;
  username?: string; // optional, as it's nullable
  name?: string; // optional, as it's nullable
  code?: string; // optional, as it's nullable
  imeiNumber?: string; // optional, as it's nullable
  brand?: string; // optional, as it's nullable
  model?: string; // optional, as it's nullable
  phone?: string; // optional, as it's nullable
  color?: string; // optional, as it's nullable
  warranty?: string; // optional, as it's nullable
  error?: string; // optional, as it's nullable
  createdBy?: string; // optional, as it's nullable
  updatedBy?: string; // optional, as it's nullable
  serviceRetrun?: boolean; // optional, as it's nullable
  dueDate?: Date; // optional, as it's nullable
  remark?: string; // optional, as it's nullable
  price?: number; // optional, as it's nullable
  technician?: string; // optional, as it's nullable
  status: Status; // status is mandatory, and it's an enum
  expense?: number; // optional, as it's nullable
  retrieveDate?: Date; // optional, as it's nullable
  condition?: string; // optional, as it's nullable
  paidAmount?: number; // optional, as it's nullable
  leftToPay?: number; // optional, as it's nullable
  createdAt: Date;
  updatedAt: Date;

  // add in api
  items?: string; // string = JSON([{name: string, price: number}])
  expense: number;
  paid: number;
  profit: number;
  // isRetrieved: boolean;
};

export type SparePart = {
  name: string;
  price: number;
};
