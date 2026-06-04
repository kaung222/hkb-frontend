import { z } from "zod";

export const CustomerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  password: z.string().optional(),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
  gender: z.string().optional(),
  points: z.number().min(0, "Points must be positive").default(0),
  branchId: z.string().min(1, "Branch is required"),
  id: z.number().optional(),
});

export type CustomerFormData = z.infer<typeof CustomerSchema>;
