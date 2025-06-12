import { z } from "zod";

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

export const AddServiceSchema = z.object({
  branchId: z.string().optional(),
  username: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  imeiNumber: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  phone: z.string().optional(),
  color: z.string().optional(),
  warranty: z.string().optional(),
  error: z.string().optional(),
  dueDate: z.string().optional(),
  remark: z.string().optional(),
  supplier: z.string().optional(),
  retrieveDate: z.any().optional(),
  price: z
    .preprocess((val) => {
      // Convert input to a number if it's a string
      if (typeof val === "string") return parseFloat(val);
      return val;
    }, z.number())
    .optional(),
  technician: z.string().optional(),
  status: z
    .enum(["retrieved", "pending", "completed", "in_progress", "cancelled"])
    .optional(), // Update with possible statuses
  expense: z.number().optional(),
  condition: z.string().optional(),
  paidAmount: z
    .preprocess((val) => {
      // Convert input to a number if it's a string
      if (typeof val === "string") return parseFloat(val);
      return val;
    }, z.number())
    .optional(),
  serviceReturn: z.string().optional(),
  leftToPay: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string(),
        price: z
          .preprocess((val) => {
            if (typeof val === "string") return parseFloat(val);
            return val;
          }, z.number())
          .default(0),
      })
    )
    .optional(),
  isRetrieved: z.string().optional(),
});

export type AddServiceValuesType = z.infer<typeof AddServiceSchema>;

export type AddServicePayloadType = Omit<
  AddServiceValuesType,
  "serviceReturn"
> & {
  serviceReturn: boolean | string;
};
