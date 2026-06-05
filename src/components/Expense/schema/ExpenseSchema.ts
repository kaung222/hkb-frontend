import { z } from "zod";

export const ExpenseSchema = z.object({
  name: z.string().min(1, "Expense name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        price: z.preprocess((val) => {
          if (typeof val === "string") return parseFloat(val);
          return val;
        }, z.number().min(0, "Price must be positive")),
      }),
    )
    .optional(),
  date: z.string().optional(),
  branchId: z.string().min(1, "Branch is required"),
  id: z.number().optional(),
});

export type ExpenseFormData = z.infer<typeof ExpenseSchema>;
