import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
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
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { SparePartsSection } from "./SparePartSection";
import { useCurrentUser } from "@/api/user/current-user";
import { useGetUser } from "@/api/user/get-users";
import { User } from "@/types/user";
import { Branch } from "@/types/branch";
import { Service } from "@/types/service";

function ServiceInput({
  label,
  placeholder,
  name,
  control,
  type = "text",
  multiline = false,
  disabled = false,
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Input
            disabled={disabled}
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

function ServiceTextArea({
  label,
  placeholder,
  name,
  control,
  disabled = false,
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Textarea
            disabled={disabled}
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
interface ServiceDialogProps {
  form: UseFormReturn<any, any, undefined>;
  technicians: User[];
  shops: Branch[];
  loading: boolean;
  handleEditService: () => void;
  handleDeleteService: () => void;
  currentServiceDetail: Service;
}

export function EditServiceDialog({
  form,
  technicians,
  shops,
  loading,
  handleEditService,
  handleDeleteService,
  currentServiceDetail,
}: ServiceDialogProps) {
  const { data: currentUser } = useCurrentUser();
  const { handleDialogChange, isOpen, openDialog, closeDialog } =
    useDialogStore();

  const handleGetVoucher = () => {
    openDialog(dialogKeys.getVoucher);
  };
  const { serviceDetail } = form.getValues();

  useEffect(() => {
    if (serviceDetail?.item) {
      const parsed = JSON.parse(serviceDetail.item || "[]");
      form.setValue("serviceDetail.spareParts", parsed);
    }
  }, [serviceDetail, form]);

  return (
    <>
      <Dialog
        open={isOpen(dialogKeys.serviceDetail)}
        onOpenChange={(isOpen) =>
          handleDialogChange(dialogKeys.serviceDetail, isOpen)
        }
      >
        <DialogContent className="rounded-lg w-full max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Service Detail
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                {/* Basic Information Section */}
                <div className="col-span-1 sm:col-span-2 font-semibold text-lg">
                  Basic Information
                </div>
                {currentUser?.role === "admin" && (
                  <ServiceSelect
                    label="Branch"
                    name="serviceDetail.branch"
                    control={form.control}
                    options={shops.map((shop) => ({
                      label: shop.name,
                      value: String(shop.branchNumber),
                    }))}
                  />
                )}
                <ServiceInput
                  label="Brand"
                  placeholder="Brand"
                  name="serviceDetail.brand"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Model"
                  placeholder="Model"
                  name="serviceDetail.model"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="IMEI"
                  placeholder="IMEI"
                  name="serviceDetail.imei"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Color"
                  placeholder="Color"
                  name="serviceDetail.color"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Error"
                  placeholder="Error"
                  name="serviceDetail.error"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceTextArea
                  label="မှတ်ချက်"
                  placeholder="Remark"
                  name="serviceDetail.remark"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />

                {/* Voucher Information Section */}
                <div className="col-span-1 sm:col-span-2 font-semibold text-lg">
                  Voucher Information
                </div>
                <ServiceInput
                  label="Voucher ID"
                  placeholder="Voucher ID"
                  name="serviceDetail.voucher"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Name"
                  placeholder="Name"
                  name="serviceDetail.customer"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Phone Number"
                  placeholder="Phone Number"
                  name="serviceDetail.phone"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="Warranty"
                  name="serviceDetail.warranty"
                  control={form.control}
                  options={[
                    { label: "Out Warranty", value: "Out" },
                    { label: "In Warranty", value: "In" },
                  ]}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="Service Return"
                  name="serviceDetail.service_return"
                  control={form.control}
                  options={[
                    { label: "No", value: "No" },
                    { label: "Yes", value: "Yes" },
                  ]}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="ရက်ချိန်း"
                  placeholder="yyyy-mm-dd"
                  type="date"
                  name="serviceDetail.due_date"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Total Amount"
                  placeholder="Total Amount"
                  name="serviceDetail.service_charges"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="ရွေးပြီး/မရွေးရသေး"
                  name="serviceDetail.is_retrieved"
                  control={form.control}
                  options={[
                    { label: "မရွေးရသေး", value: "0" },
                    { label: "ရွေးပြီး", value: "1" },
                  ]}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />

                {/* Technician and Service Information Section */}
                <div className="col-span-1 sm:col-span-2 font-semibold text-lg">
                  Technician and Service Information
                </div>
                <ServiceSelect
                  label="Technician"
                  name="serviceDetail.engineer"
                  control={form.control}
                  options={technicians.map((tech) => ({
                    label: tech.name,
                    value: tech.name,
                  }))}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="Progress"
                  name="serviceDetail.progress"
                  control={form.control}
                  options={[
                    { label: "မပြင်ရသေး", value: "မပြင်ရသေး" },
                    { label: "ပြင်နေဆဲ", value: "ပြင်နေဆဲ" },
                    { label: "ပြင်ပြီး", value: "ပြင်ပြီး" },
                  ]}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="Condition"
                  name="serviceDetail.condition"
                  disabled={
                    currentUser?.role !== "admin" &&
                    currentUser?.role !== "reception"
                  }
                  control={form.control}
                  options={[
                    { label: "ပြင်ရ", value: "ပြင်ရ" },
                    { label: "ပြင်မရ", value: "ပြင်မရ" },
                    { label: "မပြင်တော့ပါ", value: "မပြင်တော့ပါ" },
                  ]}
                />
                <ServiceInput
                  label="ပစ္စည်း Supplier"
                  placeholder="ပစ္စည်း Supplier"
                  name="serviceDetail.service_reply"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <SparePartsSection control={form.control} />
                {/* <ServiceInput
                  label="Spare Parts ( အပိုပစ္စည်း )"
                  placeholder="Spare Parts"
                  name="serviceDetail.item"
                  control={form.control}
                />
                <ServiceInput
                  label="Expense"
                  placeholder="0"
                  name="serviceDetail.expense"
                  control={form.control}
                /> */}
                <ServiceInput
                  label="Paid"
                  placeholder="0"
                  name="serviceDetail.paid"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={() => closeDialog(dialogKeys.serviceDetail)}
                  type="button"
                  variant="secondary"
                  className="transition-colors duration-200 rounded-lg shadow-sm"
                >
                  Close
                </Button>
                <Button
                  onClick={handleDeleteService}
                  type="button"
                  variant="destructive"
                  className="transition-colors duration-200 text-white rounded-lg shadow-sm"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Delete"
                  )}
                </Button>
                <Button
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                  onClick={handleEditService}
                  type="button"
                  className="transition-colors duration-200 text-white rounded-lg shadow-sm"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  onClick={() => {
                    // handleEditService();
                    handleGetVoucher();
                  }}
                  type="button"
                  className="transition-colors duration-200 hover:bg-green-600 bg-green-500 text-white rounded-lg shadow-sm"
                >
                  Get Voucher
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
