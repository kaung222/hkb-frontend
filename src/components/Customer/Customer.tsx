"use client";

import { useEffect, useState } from "react";
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
import { useCurrentUser } from "@/api/user/current-user";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const Customers = () => {
  const { openDialog } = useDialogStore();
  const [branch, setBranch] = useState("all");
  const [page, setPage] = useState(1);
  const {
    data: customersResponse,
    isLoading,
    isError,
    error,
  } = useGetCustomers({
    branchId: parseInt(branch),
    page,
  });
  const customers = customersResponse?.data || [];
  const total = customersResponse?.total || 0;
  const totalPages = Math.ceil(total / 10);
  const { data: shops } = useGerBraches();
  const [dialogKey, setDialogKey] = useState("");
  const { data: user } = useCurrentUser();
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      username: "",
      email: undefined,
      phone: undefined,
      points: 0,
    },
  });
  useEffect(() => {
    setBranch(user?.branchId?.toString() || "1");
  }, [user]);

  useEffect(() => {
    setPage(1);
  }, [branch]);

  const { mutate: deleteCustomer } = useDeleteCustomer();
  const { data: currentUser } = useCurrentUser();
  const handleEdit = (customer: Customer) => {
    form.reset({
      id: customer.id,
      username: customer.username,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      profilePicture: customer.profilePicture || undefined,
      gender: customer.gender || undefined,
      points: customer.points || 0,
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

          <Button variant="outline" onClick={() => console.log("History")}>
            History
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

        {currentUser?.role === "admin" && (
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">All Branches</SelectItem> */}
              {shops?.map((shop) => (
                <SelectItem key={shop.id} value={shop.id.toString()}>
                  {shop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : customers && customers.length > 0 ? (
          <>
            <VirtualizedTable
              data={customers}
              columns={columns}
              rowKey={(customer) => customer.id}
              onRowClick={(customer) => console.log("Row clicked:", customer)}
            />
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === page}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages || totalPages === 0}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <p>No customers available.</p>
        )}
      </div>

      <CustomerDialog form={form} dialogKey={dialogKey} />
    </div>
  );
};

export default Customers;
