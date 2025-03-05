// import { z } from "zod";

// export const ServiceFormSchema = z.object({
//   filterDate: z.string(),
//   branch: z.string(),
//   search: z.string(),
//   serviceDetail: z.object({
//     brand: z.string().optional(),
//     model: z.string().optional(),
//     imeiNumber: z.string().optional(),
//     color: z.string().optional(),
//     error: z.string().optional(),
//     remark: z.string().optional(),
//     code: z.string().optional(),
//     username: z.string().optional(),
//     phone: z.string().optional(),
//     warranty: z.string().optional(), // Example: "In" or "Out"
//     // Example: "Yes" or "No"
//     dueDate: z.date().optional(), // Example: "YYYY-MM-DD"
//     price: z.number().optional().default(0),
//     progress: z.string().optional(), // Example: "ပြင်နေဆဲ" or "မပြင်ရသေး"
//     condition: z.string().optional(), // Example: "ပြင်ရ"
//     // service_reply: z.string().optional(),
//     item: z.string().optional(),
//     expense: z.number().optional().default(0),
//     paid: z.number().optional(),
//     technician: z.string().optional(),
//     serviceReturn: z.boolean().optional(),
//     branchId: z.string().optional(),
//     items: z.string().optional(),
//     retrieveDate: z.date().optional(),
//   }),
// });

// export type ServiceFormValues = z.infer<typeof ServiceFormSchema>;
