import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ExpenseFormData } from "./schema/ExpenseSchema";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCreateExpense } from "@/api/expense/expense.mutation";
import { useGerBraches } from "@/api/branch/branch.query";
import { dialogKeys } from "@/constants/general.const";
import { Textarea } from "../ui/textarea";
import { useCurrentUser } from "@/api/user/current-user";
import { PlusCircleIcon } from "lucide-react";

interface Props {
  form: UseFormReturn<ExpenseFormData, any, undefined>;
  dialogKey: string;
}
export default function ExpenseDialog({ form, dialogKey }: Props) {
  const { isOpen, handleDialogChange, closeDialog } = useDialogStore();
  const { data: shops, isLoading } = useGerBraches();
  const { mutate, isPending } = useCreateExpense();
  const { data: currentUser } = useCurrentUser();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = form.watch("items") || [];
  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item?.price) || 0),
    0,
  );

  const onSubmit = (data: ExpenseFormData) => {
    const normalizedItems = (data.items || []).map((item) => ({
      name: item.name ?? "",
      price: Number(item.price) || 0,
    }));
    const computedAmount = normalizedItems.reduce(
      (sum, item) => sum + item.price,
      0,
    );
    const payload = {
      ...data,
      items: normalizedItems,
      branchId: parseInt(data.branchId),
      amount: computedAmount,
      date: data.date
        ? new Date(data.date).toISOString()
        : new Date().toISOString(),
    };

    mutate(payload, {
      onSuccess: () => {
        console.log("success expense created");
        closeDialog(dialogKeys.addNewExpense);
        closeDialog(dialogKeys.editExpense);
        form.reset();
      },
    });
  };

  return (
    <Dialog
      open={isOpen(dialogKey)}
      onOpenChange={(e) => {
        handleDialogChange(dialogKey, e);
        form.reset({});
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter expense name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Items</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", price: 0 })}
                >
                  <PlusCircleIcon className="mr-1 h-4 w-4" />
                  Add item
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No items added yet.
                </p>
              )}

              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Item name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="w-40">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Price"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div className="flex justify-end pt-1 text-sm font-semibold">
                Total Amount: ${totalAmount.toFixed(2)}
              </div>
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "",
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notes (optional)"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {currentUser?.role === "admin" && (
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                      </FormControl>
                      {isLoading ? (
                        <div>loading...</div>
                      ) : (
                        <SelectContent>
                          {shops?.length > 0 &&
                            shops?.map((branch) => (
                              <SelectItem
                                key={branch.id}
                                value={branch.id.toString()}
                              >
                                {branch.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      )}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
