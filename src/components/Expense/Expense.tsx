"use client";

import { useEffect } from "react";
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
import { useGerBraches } from "@/api/branch/branch.query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
import { DatePickerDemo } from "../common/DatePicker";
import { useCurrentUser } from "@/api/user/current-user";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const monthOptions = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const yearOptions = [
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
];

const Expenses = () => {
  const { openDialog } = useDialogStore();
  const { data: currentUser } = useCurrentUser();
  const { data: shops } = useGerBraches();

  const [date, setDate] = useQueryState(
    "date",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd")),
  );
  const [branch, setBranch] = useQueryState(
    "branch",
    parseAsString.withDefault("1"),
  );
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault("01"),
  );
  const [year, setYear] = useQueryState(
    "year",
    parseAsString.withDefault(new Date().getFullYear().toString()),
  );
  const [filterMode, setFilterMode] = useQueryState(
    "filterMode",
    parseAsString.withDefault("day"),
  );
  const [page, setPage] = useQueryState("page", parseAsString.withDefault("1"));

  const {
    data: expensesResponse,
    isLoading,
    isError,
    error,
  } = useGetExpenses();
  const expenses = expensesResponse?.data || [];
  const totalAmount = expensesResponse?.totalAmount || 0;
  const total = expensesResponse?.total || 0;
  const totalPages = Math.ceil(total / 10);
  const currentPage = parseInt(page);
  const [dialogKey, setDialogKey] = useState("");
  const { data: user } = useCurrentUser();
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      id: undefined,
      name: "",
      // amount: 0,
      notes: "",
      items: [],
    },
  });

  console.log(user);
  console.log(form.formState.errors);
  console.log(form.getValues("branchId"));

  const { mutate: deleteExpense } = useDeleteExpense();

  const handleEdit = (expense: Expense) => {
    form.reset({
      id: expense.id,
      name: expense.name,
      // amount: expense.amount,
      notes: expense.notes || "",
      items: expense.items || [],
      date: expense.date,
      branchId: expense.branchId,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      deleteExpense({ id: id.toString() });
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // reset to first page whenever the filters change
  useEffect(() => {
    setPage("1");
  }, [branch, date, month, year, filterMode]);

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
            form.reset({ branchId: user.branchId });
          }}
        >
          <PlusCircleIcon />
          Add new expense
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Mode:</span>
          <Select
            value={filterMode}
            onValueChange={(value) => {
              setFilterMode(value);
              value === "day"
                ? setDate(format(new Date(), "yyyy-MM-dd"))
                : setMonth("01");
            }}
          >
            <SelectTrigger className="w-[140px] rounded-lg border-gray-300 shadow-sm">
              <SelectValue placeholder="Select Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filterMode === "day" ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Date:</span>
            <DatePickerDemo
              date={new Date(date)}
              onChange={(value) => {
                if (value) {
                  setDate(format(value, "yyyy-MM-dd"));
                }
              }}
            />
          </div>
        ) : (
          <>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[140px] rounded-lg border-gray-300 shadow-sm">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y.value} value={y.value}>
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[140px] rounded-lg border-gray-300 shadow-sm">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {currentUser?.role === "admin" && (
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              {shops?.map((shop) => (
                <SelectItem key={shop.id} value={shop.branchNumber.toString()}>
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
                      onClick={() =>
                        setPage(Math.max(1, currentPage - 1).toString())
                      }
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === currentPage}
                          onClick={() => setPage(pageNum.toString())}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage(
                          Math.min(totalPages, currentPage + 1).toString(),
                        )
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
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
