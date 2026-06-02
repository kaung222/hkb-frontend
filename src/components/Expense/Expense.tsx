"use client";

import { useState } from "react";
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
export const categories = ["general", "accessories", "meal", "transportation"];

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
  const [category, setCategory] = useState("all");
  const {
    data: expensesResponse,
    isLoading,
    isError,
    error,
  } = useGetExpenses({
    branchId: branch === "all" ? undefined : parseInt(branch),
    category: category === "all" ? undefined : category,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  const expenses = expensesResponse?.data || [];
  const totalAmount = expensesResponse?.totalAmount || 0;
  const { data: shops } = useGerBraches();
  const [dialogKey, setDialogKey] = useState("");

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      id: undefined,
      name: "",
      amount: 0,
      notes: "",
      category: "",
    },
  });

  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: updateExpense } = useUpdateExpense();

  const handleEdit = (expense: Expense) => {
    form.reset({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      notes: expense.notes || "",
      category: expense.category || "",
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
      label: "Category",
      renderCell: (expense: Expense) => expense.category || "-",
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

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
          <VirtualizedTable
            data={expenses}
            columns={columns}
            rowKey={(expense) => expense.id}
            onRowClick={(expense) => console.log("Row clicked:", expense)}
          />
        ) : (
          <p>No expenses available.</p>
        )}
      </div>

      <ExpenseDialog form={form} dialogKey={dialogKey} />
    </div>
  );
};

export default Expenses;
