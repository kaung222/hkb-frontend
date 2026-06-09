import { z } from "zod";

export const ShopSchema = z.object({
  name: z.string().min(1, "Shop name is required"),
  branchNumber: z.number().min(1, "Branch number is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  pointsRate: z.number().min(1, "Points rate is required"),
  discountRate: z.number().min(1, "Discount rate is required"),
});

export type ShopFormData = z.infer<typeof ShopSchema>;
