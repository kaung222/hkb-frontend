export type Customer = {
  id: number;
  username: string;
  email?: string;
  password?: string;
  phone?: string;
  profilePicture?: string;
  gender?: string;
  points: number;
  branchId: number;
  branch?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CustomersResponse = {
  data: Customer[];
  total: number;
  page: number;
};
