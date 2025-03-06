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

export default function Service() {
  const [date, setDate] = useQueryState(
    "date",
    parseAsString.withDefault("today")
  );

  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all")
  );

  const form = useForm();
  const { data: user } = useCurrentUser();
  const { data: technicians, isLoading: isTechnicianLoading } = useGetUser();
  const { data: branches, isLoading: isBranchLoading } = useGerBraches();
  const { data: services } = useGetServiceQuery();
  const { data: detailService } = useDataStore();
  // const { services, user, form, isLoading } = useService();

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
                <FormField
                  control={form.control}
                  name="filterDate"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Date Filter</FormLabel>
                      <Select
                        {...field}
                        value={date}
                        onValueChange={(e) => {
                          field.onChange(e);
                          setDate(e);
                        }}
                      >
                        <SelectTrigger className="w-full rounded-lg border-gray-300 shadow-sm">
                          <SelectValue placeholder="Filter by Date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.role === "admin" && <BranchFilter />}

                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Search</FormLabel>
                      <FormControl>
                        <Input placeholder="Search Everything" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-x-2">
              <AddServiceDialog />
              <ServiceSummaryDialog service={services} />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px] rounded-lg border-gray-300 shadow-sm">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all</SelectItem>
                <SelectItem value="retrived">ရွေးပြီး</SelectItem>
                <SelectItem value="completed">မရွေးရသေး</SelectItem>
                <SelectItem value="pending">မရွေးရသေး</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scrollable Service List */}
      <ServiceList service={services} form={form} />
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
