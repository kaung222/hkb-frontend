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
import { UseFormReturn } from "react-hook-form";
import { ShopFormData } from "./schema/ShopSchema";
import { useDialogStore } from "@/stores/dialog/useDialogStore";

interface Props {
  form: UseFormReturn<ShopFormData, any, undefined>;
  onSubmit: (data: ShopFormData) => Promise<void>;
  dialogKey: string;
}
export default function ShopDialog({ form, onSubmit, dialogKey }: Props) {
  const { isOpen, handleDialogChange } = useDialogStore();
  return (
    <Dialog
      open={isOpen(dialogKey)}
      onOpenChange={(e) => {
        handleDialogChange(dialogKey, e);
        form.reset({
          address: "",
          branchNumber: null,
          name: "",
          phone: "",
        });
      }}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Shop</DialogTitle>
        </DialogHeader>
        {/* Shop Form */}
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
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shop name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter branch number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Phone number"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shop address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
