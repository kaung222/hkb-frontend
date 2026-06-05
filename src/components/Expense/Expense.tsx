"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ExpenseFormData, ExpenseSchema } from "./schema/ExpenseSchema";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { dialogKeys } from "@/constants/general.const";
import ExpenseDialog from "./ExpenseDialog";
import { PlusCircleIcon } from "lucide-react";
import VirtualizedTable from "../common/VirtualizedTable";
import { Expense } from "@/types/expense";
import { useGetExpenses } from "@/api/expense/expense.query";
import { useDeleteExpense } from "@/api/expense/expense.mutation";
import { useUpdateExpense } from "@/api/expense/expense.mutation";
import { useGerBraches } from "@/api/branch/branch.query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { DatePickerDemo } from "../common/DatePicker";
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

const Expenses = () => {
  const { openDialog } = useDialogStore();
  const [startDate, setStartDate] = useState<Date>(
    setHours(setMinutes(setSeconds(setMilliseconds(new Date(), 0), 0), 0), 0),
  );
  const [endDate, setEndDate] = useState<Date>(
    setHours(
      setMinutes(setSeconds(setMilliseconds(addDays(new Date(), 1), 0), 0), 0),
      23,
    ),
  );
  const [branch, setBranch] = useState("all");
  const [page, setPage] = useState(1);
  const { data: currentUser } = useCurrentUser();
  const {
    data: expensesResponse,
    isLoading,
    isError,
    error,
  } = useGetExpenses({
    branchId: branch === "all" ? undefined : parseInt(branch),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    page,
  });
  const expenses = expensesResponse?.data || [];
  const totalAmount = expensesResponse?.totalAmount || 0;
  const total = expensesResponse?.total || 0;
  const totalPages = Math.ceil(total / 10);
  const { data: shops } = useGerBraches();
  const [dialogKey, setDialogKey] = useState("");

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      id: undefined,
      name: "",
      amount: 0,
      notes: "",
      items: [],
    },
  });

  const { mutate: deleteExpense } = useDeleteExpense();

  const handleEdit = (expense: Expense) => {
    form.reset({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      notes: expense.notes || "",
      items: expense.items || [],
      date: expense.date,
      branchId: expense.branchId.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    try {
      deleteExpense({ id: id.toString() });
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  useEffect(() => {
    setBranch(currentUser?.branchId?.toString() || "1");
  }, [currentUser]);

  useEffect(() => {
    setPage(1);
  }, [branch, startDate, endDate]);

  const columns = [
    {
      label: "Name",
      renderCell: (expense: Expense) => expense.name,
    },
    {
      label: "Amount",
      renderCell: (expense: Expense) => `$${expense.amount.toFixed(2)}`,
    },
    {
      label: "Items",
      renderCell: (expense: Expense) =>
        expense.items && expense.items.length > 0
          ? expense.items.map((item) => item.name).join(", ")
          : "-",
    },
    {
      label: "Date",
      renderCell: (expense: Expense) =>
        new Date(expense.date).toLocaleDateString(),
    },
    {
      label: "Branch",
      renderCell: (expense: Expense) =>
        shops?.find((shop) => shop.id === expense.branchId)?.name || "-",
    },
    {
      label: "Notes",
      renderCell: (expense: Expense) => expense.notes || "-",
    },
    {
      label: "Actions",
      renderCell: (expense: Expense) => (
        <div className="space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setDialogKey(dialogKeys.editExpense);
              handleEdit(expense);
              openDialog(dialogKeys.editExpense);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(expense.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto p-8">
      <div className="flex flex-wrap gap-3 items-center">
        <Button
          variant="outline"
          onClick={() => {
            setDialogKey(dialogKeys.addNewExpense);
            openDialog(dialogKeys.addNewExpense);
            form.reset();
          }}
        >
          <PlusCircleIcon />
          Add new expense
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">From:</span>
          <DatePickerDemo
            date={startDate}
            onChange={(date) => {
              if (date) {
                setStartDate(
                  setHours(
                    setMinutes(setSeconds(setMilliseconds(date, 0), 0), 0),
                    0,
                  ),
                );
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">To:</span>
          <DatePickerDemo
            date={endDate}
            onChange={(date) => {
              if (date) {
                setEndDate(
                  setHours(
                    setMinutes(setSeconds(setMilliseconds(date, 0), 0), 0),
                    23,
                  ),
                );
              }
            }}
          />
        </div>

        {currentUser?.role === "admin" && (
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              {shops?.map((shop) => (
                <SelectItem key={shop.id} value={shop.id.toString()}>
                  {shop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="ml-auto text-lg font-semibold">
          Total: ${totalAmount.toFixed(2)}
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error: {error.message}</p>
        ) : expenses && expenses.length > 0 ? (
          <>
            <VirtualizedTable
              data={expenses}
              columns={columns}
              rowKey={(expense) => expense.id}
              onRowClick={(expense) => console.log("Row clicked:", expense)}
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
          <p>No expenses available.</p>
        )}
      </div>

      <ExpenseDialog form={form} dialogKey={dialogKey} />
    </div>
  );
};

export default Expenses;
