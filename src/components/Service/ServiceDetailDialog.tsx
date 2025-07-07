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
import { format, formatDate } from "date-fns";

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
      branchId: currentServiceDetail.branchId?.toString(),
      brand: currentServiceDetail.brand,
      color: currentServiceDetail.color,
      condition: currentServiceDetail.condition,
      dueDate: format(new Date(currentServiceDetail.dueDate), "yyyy-MM-dd"),
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
      supplier: currentServiceDetail.supplier,
      technician: currentServiceDetail.technician,
      warranty: currentServiceDetail.warranty,
      retrievedDate: currentServiceDetail.retrievedDate,
    },
  });

  const filterTechnicians = technicians.filter(
    (t) =>
      t.branchId === currentServiceDetail.branchId && t.role === "technician"
  );

  useEffect(() => {
    if (currentServiceDetail) {
      setSpareParts(currentServiceDetail.items || []);
      const payload = {
        code: currentServiceDetail.code || undefined,
        username: currentServiceDetail.username || undefined,
        branchId: currentServiceDetail.branchId?.toString() || undefined,
        brand: currentServiceDetail.brand || undefined,
        color: currentServiceDetail.color || undefined,
        condition: currentServiceDetail.condition || undefined,
        dueDate:
          format(new Date(currentServiceDetail.dueDate), "yyyy-MM-dd") ||
          undefined,
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
        supplier: currentServiceDetail.supplier || undefined,
        technician: currentServiceDetail.technician || undefined,
        warranty: currentServiceDetail.warranty || undefined,
        retrievedDate: currentServiceDetail.retrievedDate || undefined,
        createdAt: currentServiceDetail.createdAt || undefined,
      };
      form.reset(payload);
    }
  }, [currentServiceDetail, form]);

  const handleEditService = (values: AddServiceValuesType) => {
    const retrievedDate = values.retrievedDate
      ? new Date(values.retrievedDate)
      : new Date();
    console.log(retrievedDate, "retrieve date");
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
        retrievedDate,
      },
      {
        onSuccess: () => {
          closeDialog(dialogKeys.serviceDetail);
        },
      }
    );
  };

  const handleDeleteService = () => {
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
                    defaultValue={currentServiceDetail.branchId?.toString()}
                    options={shops.map((shop) => ({
                      label: shop.name,
                      value: shop.id?.toString(),
                    }))}
                  />
                )}
                <ServiceInput
                  label="Brand"
                  placeholder="Brand"
                  name="brand"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Model"
                  placeholder="Model"
                  name="model"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="IMEI"
                  placeholder="IMEI"
                  name="imeiNumber"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Color"
                  placeholder="Color"
                  name="color"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Error"
                  placeholder="Error"
                  name="error"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceTextArea
                  label="မှတ်ချက်"
                  placeholder="Remark"
                  name="remark"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
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
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Customer Name"
                  placeholder="Customer name"
                  name="username"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Phone Number"
                  placeholder="Phone Number"
                  name="phone"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
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
                    currentServiceDetail?.retrievedDate !== null &&
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
                    currentServiceDetail?.retrievedDate !== null &&
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
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceInput
                  label="Total Amount"
                  placeholder="Total Amount"
                  name="price"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                {/* <ServiceSelect
                  label="ရွေးပြီး/မရွေးရသေး"
                  name="progress"
                  control={form.control}
                  defaultValue={
                    currentServiceDetail.status !== "retrieved"
                      ? "in_progress"
                      : currentServiceDetail.status
                  }
                  options={[
                    { label: "မရွေးရသေး", value: Status.IN_PROGRESS },
                    { label: "ရွေးပြီး", value: "retrieved" },
                    //  { label: "ရွေးပြီး", value: Status.RETRIEVED },
                  ]}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                /> */}

                {currentUser.role === "admin" && (
                  <ServiceInput
                    label="ပစ္စည်းအပ်နေ့"
                    placeholder="ပစ္စည်းအပ်နေ့"
                    name="createdAt"
                    control={form.control}
                    disabled={currentUser?.role !== "admin"}
                  />
                )}

                {currentUser.role === "admin" && (
                  <ServiceInput
                    label="ပစ္စည်းရွေးနေ့"
                    placeholder="ပစ္စည်းရွေးနေ့"
                    name="retrievedDate"
                    control={form.control}
                    disabled={
                      currentServiceDetail?.retrievedDate !== null &&
                      currentUser?.role !== "admin"
                    }
                  />
                )}

                {/* Technician and Service Information Section */}
                <div className="col-span-1 sm:col-span-2 font-semibold text-lg">
                  Technician and Service Information
                </div>
                <ServiceSelect
                  label="Technician"
                  name="technician"
                  defaultValue={currentServiceDetail.technician}
                  control={form.control}
                  options={filterTechnicians.map((tech) => ({
                    label: tech.name,
                    value: tech.name,
                  }))}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="Progress"
                  name="status"
                  defaultValue={currentServiceDetail.status}
                  control={form.control}
                  options={[
                    { label: "မပြင်ရသေး", value: Status.PENDING },
                    { label: "ပြင်နေဆဲ", value: Status.IN_PROGRESS },
                    { label: "ပြင်ပြီး", value: Status.COMPLETED },
                    { label: "ရွေးပြီး", value: Status.RETRIEVED },
                  ]}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <ServiceSelect
                  label="Condition"
                  name="condition"
                  disabled={
                    currentUser?.role !== "admin" &&
                    // currentUser?.role !== "reception"
                    currentServiceDetail.retrievedDate !== null
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
                  name="supplier"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                />
                <SparePartsSection
                  spareParts={spareParts}
                  setSpareParts={setSpareParts}
                />

                {/* <ServiceInput
                  label="Paid"
                  placeholder="0"
                  name="paidAmount"
                  control={form.control}
                  disabled={
                    currentServiceDetail?.retrievedDate !== null &&
                    currentUser?.role !== "admin"
                  }
                /> */}
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
                  //@ts-expect-error
                  onClick={() => form.setValue("status", "retrieved")}
                  type="button"
                  variant="ghost"
                  className="transition-colors border border-black duration-200 rounded-lg shadow-sm"
                >
                  ယခုရွေးမည်
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
                    currentServiceDetail?.retrievedDate !== null &&
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
