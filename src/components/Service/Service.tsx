"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServiceList from "./ServiceList";
import { AddServiceDialog } from "./AddServiceDialog";
import { parseAsString, useQueryState } from "nuqs";
import ServiceSummaryDialog from "./ServiceSummaryDialog";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "@/api/user/current-user";
import { useGetServiceQuery } from "@/api/service/service.query";
import BranchFilter from "./branch-filter";
import { EditServiceDialog } from "./ServiceDetailDialog";
import { useGetUser } from "@/api/user/get-users";
import { useGerBraches } from "@/api/branch/branch.query";
import { useDataStore } from "@/stores/useDataStore";
import VoucherDialog from "./VoucherDialog";
import { DatePickerDemo } from "../common/DatePicker";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

export enum Status {
  RETRIEVED = "retrieved",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  PENNDING = "pending",
}

export default function Service() {
  const [date, setDate] = useQueryState(
    "date",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd"))
  );
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault("01")
  );

  const [queryMode, setQueryMode] = useQueryState(
    "queryMode",
    parseAsString.withDefault("createdDate")
  );

  const [filterMode, setFilterMode] = useQueryState(
    "filterMode",
    parseAsString.withDefault("day")
  );

  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all")
  );

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

  const form = useForm();
  const { data: user } = useCurrentUser();
  const { data: technicians, isLoading: isTechnicianLoading } = useGetUser();
  const { data: branches, isLoading: isBranchLoading } = useGerBraches();
  const { data: services, refetch, isPending } = useGetServiceQuery();
  const { data: detailService } = useDataStore();
  const [search, setSearch] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = async () => {
    setIsSpinning(true);
    refetch();
    // Ensure spinning animation lasts at least 500ms
    setTimeout(() => {
      setIsSpinning(false);
    }, 500);
  };

  const filterService = () => {
    const searchServices = services?.filter((service) => {
      const searchTerm = search.toLowerCase();
      return (
        service.code.toLowerCase().includes(searchTerm) ||
        service.username.toLowerCase().includes(searchTerm) ||
        service.phone.toLowerCase().includes(searchTerm) ||
        service.brand.toLowerCase().includes(searchTerm) ||
        service.model.toLowerCase().includes(searchTerm)
      );
    });
    switch (status) {
      case "retrived":
        return searchServices?.filter(
          (service) => service.status === Status.RETRIEVED
        );
      case "completed":
        return searchServices?.filter(
          (service) => service.retrieveDate === null
        );
      default:
        return searchServices;
    }
  };

  const handleDateChange = (newDate: Date) => {
    // Convert the new date to a string format (e.g., "YYYY-MM-DD")
    const formattedDate = format(newDate, "yyyy-MM-dd");
    setDate(formattedDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 flex flex-col gap-6 bg-muted overflow-hidden" // Keep overflow-hidden here
    >
      {/* Form Card */}
      <Card className="w-full mx-auto shadow-lg rounded-lg sticky top-0 z-10">
        <CardContent className="p-6 space-y-4">
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
                                  <SelectItem
                                    key={month.value}
                                    value={month.value}
                                  >
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
                      placeholder="Search Everything"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            </form>
          </Form>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-x-2">
              <AddServiceDialog />
              <ServiceSummaryDialog services={filterService()} />
            </div>
            <div className="flex gap-x-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
                  <SelectValue placeholder="Filter By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">အားလုံး</SelectItem>
                  <SelectItem value="retrived">ရွေးပြီး</SelectItem>
                  <SelectItem value="completed">မရွေးရသေး</SelectItem>
                  {/* <SelectItem value="pending">မရွေးရသေး</SelectItem> */}
                </SelectContent>
              </Select>
              <Select value={queryMode} onValueChange={setQueryMode}>
                <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
                  <SelectValue placeholder="Created Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdDate">Created Date</SelectItem>
                  <SelectItem value="retrievedDate">Retrieved Date</SelectItem>
                  {/* <SelectItem value="pending">မရွေးရသေး</SelectItem> */}
                </SelectContent>
              </Select>
              {/* <Button
                variant="outline"
                title="refresh"
                onClick={() => handleRefresh()}
              >
                <RefreshCcw
                  className={`size-6  ${
                    isSpinning ? " animate-spin" : ""
                  } duration-500`}
                />
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scrollable Service List */}
      <ServiceList service={filterService()} form={form} />
      {detailService && (
        <EditServiceDialog
          technicians={technicians}
          shops={branches}
          loading={isTechnicianLoading || isBranchLoading}
          currentServiceDetail={detailService}
        />
      )}
      <VoucherDialog serviceDetail={detailService} />
    </motion.div>
  );
}
