"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CustomerFormData, CustomerSchema } from "./schema/CustomerSchema";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { dialogKeys } from "@/constants/general.const";
import CustomerDialog from "./CustomerDialog";
import { PlusCircleIcon } from "lucide-react";
import VirtualizedTable from "../common/VirtualizedTable";
import { Customer } from "@/types/customer";
import { useGetCustomers } from "@/api/customer/customer.query";
import { useDeleteCustomer } from "@/api/customer/customer.mutation";
import { useUpdateCustomer } from "@/api/customer/customer.mutation";
import { useGerBraches } from "@/api/branch/branch.query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Customers = () => {
  const { openDialog } = useDialogStore();
  const { data: customers, isLoading, isError, error } = useGetCustomers();
  const { data: shops } = useGerBraches();
  const [dialogKey, setDialogKey] = useState("");
  const [branch, setBranch] = useState("all");
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      points: 0,
    },
  });

  const filterCustomers = () => {
    if (branch === "all") {
      return customers;
    }
    return customers?.filter(
      (customer) => customer.branchId === parseInt(branch),
    );
  };

  const { mutate: deleteCustomer } = useDeleteCustomer();
  const { mutate: updateCustomer } = useUpdateCustomer();

  const handleEdit = (customer: Customer) => {
    form.reset({
      username: customer.username,
      email: customer.email || "",
      phone: customer.phone || "",
      profilePicture: customer.profilePicture || "",
      gender: customer.gender || "",
      points: customer.points,
      branchId: customer.branchId.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    try {
      deleteCustomer({ id: id.toString() });
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  const columns = [
    {
      label: "Username",
      renderCell: (customer: Customer) => customer.username,
    },
    {
      label: "Email",
      renderCell: (customer: Customer) => customer.email || "-",
    },
    {
      label: "Phone",
      renderCell: (customer: Customer) => customer.phone || "-",
    },
    {
      label: "Branch",
      renderCell: (customer: Customer) =>
        shops?.find((shop) => shop.id === customer.branchId)?.name || "-",
    },
    {
      label: "Points",
      renderCell: (customer: Customer) => customer.points,
    },
    {
      label: "Gender",
      renderCell: (customer: Customer) => customer.gender || "-",
    },
    {
      label: "Actions",
      renderCell: (customer: Customer) => (
        <div className="space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setDialogKey(dialogKeys.editCustomer);
              handleEdit(customer);
              openDialog(dialogKeys.editCustomer);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(customer.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto p-8">
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setDialogKey(dialogKeys.addNewCustomer);
            openDialog(dialogKeys.addNewCustomer);
            form.reset();
          }}
        >
          <PlusCircleIcon />
          Add new customer
        </Button>

        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
            <SelectValue placeholder="Filter by branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {shops?.map((shop) => (
              <SelectItem key={shop.id} value={shop.id.toString()}>
                {shop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : customers && customers.length > 0 ? (
          <VirtualizedTable
            data={filterCustomers()}
            columns={columns}
            rowKey={(customer) => customer.id}
            onRowClick={(customer) => console.log("Row clicked:", customer)}
          />
        ) : (
          <p>No customers available.</p>
        )}
      </div>

      <CustomerDialog form={form} dialogKey={dialogKey} />
    </div>
  );
};

export default Customers;
