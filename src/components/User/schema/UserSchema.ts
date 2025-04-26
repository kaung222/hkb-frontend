import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Shop name is required"),
  email: z.string().min(1, "Email is required."),
  branchId: z.string().min(1, "Branch is required"),
  role: z.string().min(1, "Role is required."),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().min(1, "Password is required."),
});

export type UserFormData = z.infer<typeof UserSchema>;
