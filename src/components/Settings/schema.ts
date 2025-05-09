import { z } from "zod";

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required."),
  password: z.string().min(6, "New password is required."),
  confirmPassword: z.string().min(6, "Confirm password is required."),
});

export type PasswordChangePayload = z.infer<typeof ChangePasswordSchema>;
