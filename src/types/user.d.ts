export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  branchId: number;
  role: "admin" | "technician" | "reception";
  address: string;
};
