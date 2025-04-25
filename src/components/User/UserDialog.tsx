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
import { UserFormData } from "./schema/UserSchema";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCreateUser } from "@/api/user/create-user";
import { useGerBraches } from "@/api/branch/branch.query";
import { dialogKeys } from "@/constants/general.const";

interface Props {
  form: UseFormReturn<UserFormData, any, undefined>;
  dialogKey: string;
}
export default function ShopDialog({ form, dialogKey }: Props) {
  const { isOpen, handleDialogChange, closeDialog } = useDialogStore();
  const { data: shops, isLoading } = useGerBraches();
  const { mutate, isPending } = useCreateUser();
  const onSubmit = (data: any) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        console.log("success user created");
        closeDialog(dialogKeys.addNewUser);
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
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>User</DialogTitle>
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
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
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
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-between">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="reception">Reception</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Branch</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
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
                          {/* <SelectItem value="all">All</SelectItem> */}
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
            </div>

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
