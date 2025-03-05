import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Loader2 } from "lucide-react";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { dialogKeys } from "@/constants/general.const";
import { Textarea } from "../ui/textarea";
import { SparePartsSection } from "./SparePartSection";
import { useGetUser } from "@/api/user/get-users";
import { useCurrentUser } from "@/api/user/current-user";
import { useAddServiceMutation } from "@/api/service/service.mutation";
import { useForm } from "react-hook-form";
import { formatDate } from "date-fns";
import { useGerBraches } from "@/api/branch/branch.query";

function ServiceInput({
  label,
  placeholder,
  name,
  control,
  type = "text",
  multiline = false,
  defaultValue = "",
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Input
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...field}
            type={type}
            className="border-gray-300 shadow-sm rounded-lg"
            multiple={multiline}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ServiceTextArea({ label, placeholder, name, control }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="border-gray-300 shadow-sm rounded-lg"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ServiceSelect({ label, name, control, options, disabled = false }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger className="border-gray-300 shadow-sm rounded-lg">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function AddServiceDialog() {
  const { data: currentUser } = useCurrentUser();
  const { handleDialogChange, isOpen, closeDialog } = useDialogStore();
  const { mutate, isPending } = useAddServiceMutation();
  const { data: users } = useGetUser();
  const { data: user } = useCurrentUser();
  const form = useForm({
    defaultValues: {
      code: "",
      username: "James",
      branch: "",
      brand: "",
      color: "",
      condition: "",
      dueDate: formatDate(new Date(), "yy-MM-dd"),
      error: "",
      imeiNumber: "",
      isRetrieved: false,
      model: "",
      paid: 0,
      phone: "",
      price: 0,
      progress: "",
      remark: "",
      // status: Status.IN_PROGRESS,
      serviceReturn: "No",
      serviceSupplier: "",
      technician: "",
      warranty: "",
    },
  });
  const technicians = users?.filter((user) => user.role === "technician") || [];
  const handleAddService = () => {
    console.log(form.getValues());
  };
  return (
    <Dialog
      open={isOpen(dialogKeys.addService)}
      onOpenChange={(isOpen) =>
        handleDialogChange(dialogKeys.addService, isOpen)
      }
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="transition-colors duration-200 rounded-lg shadow-sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg w-full max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            ဆားဗစ်လက်ခံ
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {/* Basic Information Section */}
          <div className="col-span-1 sm:col-span-2 font-semibold text-lg">
            Basic Information
          </div>

          {currentUser?.role === "admin" && <BranchSelect form={form} />}

          <ServiceInput
            label="Brand"
            placeholder="Brand"
            name="brand"
            control={form.control}
          />
          <ServiceInput
            label="Model"
            placeholder="Model"
            name="model"
            control={form.control}
          />
          <ServiceInput
            label="IMEI"
            placeholder="IMEI"
            name="imeiNumber"
            control={form.control}
          />
          <ServiceInput
            label="Color"
            placeholder="Color"
            name="color"
            control={form.control}
          />
          <ServiceInput
            label="Error"
            placeholder="Error"
            name="error"
            control={form.control}
          />
          <ServiceTextArea
            label="မှတ်ချက်"
            placeholder="Remark"
            name="remark"
            control={form.control}
          />

          {/* Voucher Information Section */}
          <div className="col-span-1 sm:col-span-2 font-semibold text-lg">
            Voucher Information
          </div>
          <ServiceInput
            label="Voucher ID"
            placeholder="Voucher ID"
            name="code"
            defaultValue="HKB_SERVICE_2025_03_01"
            control={form.control}
          />
          <ServiceInput
            label="Customer Name"
            placeholder="Mg Mg"
            name="username"
            control={form.control}
          />
          <ServiceInput
            label="Phone Number"
            placeholder="Phone Number"
            name="phone"
            control={form.control}
          />
          <ServiceSelect
            label="Warranty"
            name="warranty"
            control={form.control}
            options={[
              { label: "Out Warranty", value: "Out" },
              { label: "In Warranty", value: "In" },
            ]}
          />
          <ServiceSelect
            label="Service Return"
            name="serviceReturn"
            control={form.control}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
          />
          <ServiceInput
            label="ရက်ချိန်း"
            placeholder="yyyy-mm-dd"
            name="dueDate"
            defaultValue={new Date().toString()}
            type="date"
            control={form.control}
          />

          <ServiceInput
            label="Total Amount"
            placeholder="Total Amount"
            name="price"
            control={form.control}
          />
          <ServiceSelect
            label="ရွေးပြီး/မရွေးရသေး"
            name="is_retrieved"
            control={form.control}
            options={[
              { label: "ရွေးပြီး", value: "1" },
              { label: "မရွေးရသေး", value: "0" },
            ]}
          />

          {/* Technician and Service Information Section */}
          <div className="col-span-1 sm:col-span-2 font-semibold text-lg">
            Technician and Service Information
          </div>
          <ServiceSelect
            label="Technician"
            name="technician"
            control={form.control}
            options={technicians.map((tech) => ({
              label: tech.name,
              value: tech.name,
            }))}
          />
          <ServiceSelect
            label="Progress"
            name="progress"
            control={form.control}
            options={[
              { label: "မပြင်ရသေး", value: "မပြင်ရသေး" },
              { label: "ပြင်နေဆဲ", value: "ပြင်နေဆဲ" },
              { label: "ပြင်ပြီး", value: "ပြင်ပြီး" },
            ]}
          />
          <ServiceSelect
            label="Condition"
            name="condition"
            control={form.control}
            disabled={
              currentUser?.role !== "admin" && currentUser?.role !== "reception"
            }
            options={[
              { label: "ပြင်ရ", value: "ပြင်ရ" },
              { label: "ပြင်မရ", value: "ပြင်မရ" },
              { label: "မပြင်တော့ပါ", value: "မပြင်တော့ပါ" },
            ]}
          />
          <ServiceInput
            label="ပစ္စည်း Supplier"
            placeholder="ပစ္စည်း Supplier"
            name="serviceSupplier"
            control={form.control}
          />

          <SparePartsSection control={form.control} />
          <ServiceInput
            label="Paid"
            placeholder="0"
            name="paid"
            control={form.control}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => closeDialog(dialogKeys.addService)}
            type="button"
            variant="secondary"
            className="transition-colors duration-200 rounded-lg shadow-sm"
          >
            Close
          </Button>
          <Button
            onClick={handleAddService}
            type="button"
            className="transition-colors duration-200 text-white rounded-lg shadow-sm"
          >
            {isPending ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Save Service"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const BranchSelect = ({ form }) => {
  const { data: shops } = useGerBraches();
  const options = shops.map((shop) => ({
    label: shop.name,
    value: shop.branchNumber.toString(),
  }));
  return (
    <ServiceSelect
      control={form.control}
      label={"Branch"}
      name="branch"
      options={options}
    />
  );
};
