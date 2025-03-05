"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useInventoryStore from "@/stores/inventory/useInventoryStore";
import { useSaveSaleMutation } from "@/api/inventory/inventory.mutation";
import { generateVoucher } from "@/lib/utils";
import { toast } from "sonner";
import { ERROR_MSG, SUCCESS_MSG } from "@/constants/general.const";
import { parseAsString, useQueryState } from "nuqs";

const saleFormSchema = z.object({
  voucher: z.string().min(1, { message: "Voucher is required" }),
  customer: z.string().optional(),
  payment: z.string().optional(),
  itemCode: z.string().optional(),
  itemName: z.string().optional(),
  amount: z.coerce.number().nonnegative().default(0),
  qty: z.coerce.number().int().positive().default(1),
  tax: z.coerce.number().nonnegative().default(0),
  discount: z.coerce.number().nonnegative().default(0),
  total: z.coerce.number().nonnegative().default(0),
  remain: z.coerce.number().nonnegative().default(0),
});

type SaleFormValues = z.infer<typeof saleFormSchema>;

export default function SaleDialog() {
  const {
    dialogOpen,
    setDialogOpen,
    selectedSale: initialData,
    // branch,
  } = useInventoryStore();

  const { mutate: saveSale } = useSaveSaleMutation();
  const [branch] = useQueryState("branch", parseAsString.withDefault("all"));

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      voucher: initialData?.voucher || "",
      customer: initialData?.customer || "",
      payment: initialData?.payment || "",
      itemCode: initialData?.itemCode || "",
      itemName: initialData?.itemName || "",
      amount: initialData?.amount || 0,
      qty: initialData?.qty || 1,
      tax: initialData?.tax || 0,
      discount: initialData?.discount || 0,
      total: initialData?.total || 0,
      remain: initialData?.remain || 0,
    },
  });

  const onSubmit = (data: SaleFormValues) => {
    // Construct the payload
    const payload = {
      ...data,
      branch: branch || "", // Ensure branch is defined
      user: "currentUser", // Replace with actual logged-in user ID or name
      itemCode: data.itemCode || "", // Provide default empty string if missing
      itemName: data.itemName || "",
      customer: data.customer || "N/A", // Provide a default customer value
      payment: data.payment || "Cash", // Provide default payment method
      lot: "test",
      paid: 0,
      damage: 0,
    };

    console.log("Payload:", payload); // Debug the payload

    saveSale(payload, {
      onSuccess: () => {
        toast.success(SUCCESS_MSG);
        setDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || ERROR_MSG);
      },
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.voucher ? "Edit Sale" : "Add New Sale"}
          </DialogTitle>
          <DialogDescription>
            {initialData?.voucher
              ? "Update the sale details below."
              : "Fill in the sale details below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="voucher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voucher</FormLabel>
                    <FormControl>
                      <Input placeholder="Voucher" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment</FormLabel>
                    <FormControl>
                      <Input placeholder="Payment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itemCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Item Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Tax" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Discount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Total" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remaining</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Remaining" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="gap-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
