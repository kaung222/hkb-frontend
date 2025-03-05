export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  branch?: string;
  role: "admin" | "technician" | "reception";
  address: string;
};
