import React from "react";
import ItemTable from "./ItemTable";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePickerDemo } from "../common/DatePicker";
import BranchFilter from "../Service/branch-filter";
import { Input } from "../ui/input";
import { useCurrentUser } from "@/api/user/current-user";
import { format } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
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

const Inventory: React.FC = () => {
  const [date, setDate] = useQueryState(
    "date",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd"))
  );
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault("01")
  );

  const [filterMode, setFilterMode] = useQueryState(
    "filterMode",
    parseAsString.withDefault("day")
  );
  const [search, setSearch] = React.useState("");
  const form = useForm();
  const { data: user } = useCurrentUser();

  const handleDateChange = (newDate: Date) => {
    // Convert the new date to a string format (e.g., "YYYY-MM-DD")
    const formattedDate = format(newDate, "yyyy-MM-dd");
    setDate(formattedDate);
  };
  return (
    <div className="p-8 space-y-4">
      <Form {...form}>
        <form className="space-y-4">
          {/* Filter and Branch Select */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-row gap-2 min-w-[200px]">
              <FormField
                control={form.control}
                name="filterMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filter Mode</FormLabel>
                    <Select
                      value={filterMode}
                      onValueChange={(e) => {
                        field.onChange(e);
                        setFilterMode(e);
                        // Reset date when changing mode
                        e === "day"
                          ? setDate(format(new Date(), "yyyy-MM-dd"))
                          : setMonth("01");
                      }}
                    >
                      <SelectTrigger className="w-full rounded-lg border-gray-300 shadow-sm">
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {filterMode === "day" ? (
                <>
                  <FormField
                    control={form.control}
                    name="filterDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Filter</FormLabel>
                        <div>
                          <DatePickerDemo
                            date={new Date(date)}
                            onChange={(e) => {
                              field.onChange(e);
                              handleDateChange(e);
                            }}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="monthFilter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Filter</FormLabel>

                        <Select
                          {...field}
                          value={month}
                          onValueChange={(e) => {
                            field.onChange(e);
                            setMonth(e);
                          }}
                        >
                          <SelectTrigger className="w-[160px] rounded-lg border-gray-300 shadow-sm">
                            <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {monthOptions.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {user?.role === "admin" && <BranchFilter />}

            <FormItem className="flex-1">
              <FormLabel>Search</FormLabel>
              <FormControl>
                <Input
                  placeholder="Search by vr code"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </form>
      </Form>
      {/* <InventoryBody /> */}
      <ItemTable search={search} />
    </div>
  );
};

export default Inventory;
