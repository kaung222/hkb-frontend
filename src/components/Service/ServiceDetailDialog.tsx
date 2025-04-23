import React, { useEffect, useState } from "react";
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
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { SparePartsSection } from "./SparePartSection";
import { useCurrentUser } from "@/api/user/current-user";
import { User } from "@/types/user";
import { Branch } from "@/types/branch";
import { Service, SparePart } from "@/types/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddServiceSchema, AddServiceValuesType } from "./schema/ServiceSchema";
import {
  useDeleteService,
  useUpdateService,
} from "@/api/service/service.mutation";
import { AlertDialogApp } from "../common/AlertDialogApp";

enum Status {
  RETRIEVED = "retrieved",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENDING = "pending",
}

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

function ServiceSelect({
  label,
  name,
  control,
  defaultValue = undefined,
  options,
  disabled = false,
}) {
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
            defaultValue={defaultValue || field.value}
          >
            <SelectTrigger
              value={field.value}
              className="border-gray-300 shadow-sm rounded-lg"
            >
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
  // form: UseFormReturn<any, any, undefined>;
  technicians: User[];
  shops: Branch[];
  loading: boolean;
  currentServiceDetail: Service;
}

export function EditServiceDialog({
  technicians,
  shops,
  loading,
  currentServiceDetail,
}: ServiceDialogProps) {
  const { data: currentUser } = useCurrentUser();
  const { handleDialogChange, isOpen, openDialog, closeDialog } =
    useDialogStore();

  const handleGetVoucher = () => {
    openDialog(dialogKeys.getVoucher);
  };

  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const { mutate } = useUpdateService(currentServiceDetail.id);
  const { mutate: deleteService } = useDeleteService();
  const form = useForm({
    resolver: zodResolver(AddServiceSchema),
    defaultValues: {
      code: currentServiceDetail.code || undefined,
      username: currentServiceDetail.username,
      branchId: currentServiceDetail.branchId.toString(),
      brand: currentServiceDetail.brand,
      color: currentServiceDetail.color,
      condition: currentServiceDetail.condition,
      dueDate: currentServiceDetail.dueDate,
      error: currentServiceDetail.error,
      imeiNumber: currentServiceDetail.imeiNumber,
      serviceReturn: currentServiceDetail.serviceRetrun ? "yes" : "no",
      isRetrieved: currentServiceDetail.isRetrieved,
      model: currentServiceDetail.model,
      paidAmount: currentServiceDetail.paidAmount,
      phone: currentServiceDetail.phone,
      price: currentServiceDetail.price,
      progress: currentServiceDetail.progress,
      remark: currentServiceDetail.remark,
      status: currentServiceDetail.status,
      serviceSupplier: currentServiceDetail.supplier,
      technician: currentServiceDetail.technician,
      warranty: currentServiceDetail.warranty,
    },
  });

  useEffect(() => {
    if (currentServiceDetail) {
      setSpareParts(currentServiceDetail.items || []);
      const payload = {
        code: currentServiceDetail.code || undefined,
        username: currentServiceDetail.username || undefined,
        branchId: currentServiceDetail.branchId.toString() || undefined,
        brand: currentServiceDetail.brand || undefined,
        color: currentServiceDetail.color || undefined,
        condition: currentServiceDetail.condition || undefined,
        dueDate: currentServiceDetail.dueDate || undefined,
        error: currentServiceDetail.error || undefined,
        imeiNumber: currentServiceDetail.imeiNumber || undefined,
        isRetrieved: currentServiceDetail.isRetrieved || undefined,
        model: currentServiceDetail.model || undefined,
        paidAmount: currentServiceDetail.paidAmount || undefined,
        phone: currentServiceDetail.phone || undefined,
        price: currentServiceDetail.price || undefined,
        progress: currentServiceDetail.progress || undefined,
        remark: currentServiceDetail.remark || undefined,
        status: currentServiceDetail.status,
        serviceReturn:
          currentServiceDetail.serviceRetrun == true
            ? "yes"
            : currentServiceDetail.serviceRetrun == false
            ? "no"
            : undefined,
        serviceSupplier: currentServiceDetail.supplier || undefined,
        technician: currentServiceDetail.technician || undefined,
        warranty: currentServiceDetail.warranty || undefined,
      };
      form.reset(payload);
    }
  }, [currentServiceDetail, form]);

  const handleEditService = (values: AddServiceValuesType) => {
    mutate(
      {
        ...values,
        price: values.price,
        serviceReturn:
          values.serviceReturn == "yes"
            ? true
            : values.serviceReturn == "no"
            ? false
            : undefined,
        items: spareParts.map((item) => ({
          name: item.name,

          price: item.price,
        })),
      },
      {
        onSuccess: () => {
          closeDialog(dialogKeys.serviceDetail);
        },
      }
    );
  };

  const handleDeleteService = () => {
    console.log("delete");

    deleteService(
      { id: currentServiceDetail.id },
      {
        onSuccess: () => {
          closeDialog(dialogKeys.serviceDetail);
        },
      }
    );
  };

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
            <form onSubmit={form.handleSubmit(handleEditService)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                {/* Basic Information Section */}
                <div className="col-span-1 sm:col-span-2 font-semibold text-lg">
                  Basic Information
                </div>
                {currentUser?.role === "admin" && (
                  <ServiceSelect
                    label="Branch"
                    name="branchId"
                    control={form.control}
                    defaultValue={currentServiceDetail.branchId.toString()}
                    options={shops.map((shop) => ({
                      label: shop.name,
                      value: shop.id.toString(),
                    }))}
                  />
                )}
                <ServiceInput
                  label="Brand"
                  placeholder="Brand"
                  name="brand"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Model"
                  placeholder="Model"
                  name="model"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="IMEI"
                  placeholder="IMEI"
                  name="imeiNumber"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Color"
                  placeholder="Color"
                  name="color"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Error"
                  placeholder="Error"
                  name="error"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceTextArea
                  label="မှတ်ချက်"
                  placeholder="Remark"
                  name="remark"
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
                  name="code"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Customer Name"
                  placeholder="Customer name"
                  name="username"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Phone Number"
                  placeholder="Phone Number"
                  name="phone"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="Warranty"
                  name="warranty"
                  control={form.control}
                  defaultValue={currentServiceDetail.warranty}
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
                  name="serviceReturn"
                  defaultValue={currentServiceDetail.serviceRetrun}
                  control={form.control}
                  options={[
                    { label: "No", value: "no" },
                    { label: "Yes", value: "yes" },
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
                  name="dueDate"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Total Amount"
                  placeholder="Total Amount"
                  name="price"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="ရွေးပြီး/မရွေးရသေး"
                  name="isRetrieved"
                  defaultValue={currentServiceDetail.isRetrieved}
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
                  name="technician"
                  defaultValue={currentServiceDetail.technician}
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
                  name="status"
                  defaultValue={currentServiceDetail.progress}
                  control={form.control}
                  options={[
                    { label: "မပြင်ရသေး", value: Status.PENDING },
                    { label: "ပြင်နေဆဲ", value: Status.IN_PROGRESS },
                    { label: "ပြင်ပြီး", value: Status.COMPLETED },
                    { label: "ywayပြီး", value: Status.RETRIEVED },
                  ]}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="Condition"
                  name="condition"
                  disabled={
                    currentUser?.role !== "admin" &&
                    // currentUser?.role !== "reception"
                    currentServiceDetail.retrieveDate !== null
                  }
                  defaultValue={currentServiceDetail.condition}
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
                  name="serviceReturn"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <SparePartsSection
                  spareParts={spareParts}
                  setSpareParts={setSpareParts}
                />
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
                  name="paidAmount"
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
                <AlertDialogApp
                  trigger={
                    <Button
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
                  }
                  onConfirm={() => handleDeleteService()}
                  buttonText="Delete"
                >
                  <p>
                    This action cannot be undone. This will permanently delete
                    your service and remove your data from our servers.
                  </p>
                </AlertDialogApp>

                <Button
                  disabled={
                    currentServiceDetail?.retrieveDate !== null &&
                    currentUser?.role !== "admin"
                  }
                  type="submit"
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
