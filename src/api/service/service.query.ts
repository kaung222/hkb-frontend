import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { Service } from "@/types/service";
import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";
interface GetServiceProps {
  queryKey: any;
  filterDate: any;
}

export const useGetServiceQuery = () => {
  const year = new Date().getFullYear();
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

  const startDate = startOfMonth(new Date(year, parseInt(month) - 1));
  const endDate = endOfMonth(new Date(year, parseInt(month) - 1));

  // const { startDate, endDate } = dateFilter(date);

  return useQuery<Service[]>({
    queryKey: ["GetServices", startDate, endDate, date, filterMode],
    queryFn: async () => {
      return api
        .get(`/services/by/created-date`, {
          params: {
            startDate:
              filterMode === "day" ? date : format(startDate, "yyyy-MM-dd"),
            endDate:
              filterMode === "day"
                ? format(addDays(new Date(date), 1), "yyyy-MM-dd")
                : format(endDate, "yyyy-MM-dd"),
          },
        })
        .then((res) => res.data);
    },
  });
};
