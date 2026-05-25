import { z } from "zod";

export const ExpenseSchema = z.object({
  name: z.string().min(1, "Expense name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  notes: z.string().optional(),
  category: z.string().optional(),
  date: z.string().optional(),
  branchId: z.string().min(1, "Branch is required"),
});

export type ExpenseFormData = z.infer<typeof ExpenseSchema>;
