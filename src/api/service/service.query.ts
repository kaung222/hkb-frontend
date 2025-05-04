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
import { useGerBraches } from "../branch/branch.query";
import { useCurrentUser } from "../user/current-user";
import { useParams } from "react-router-dom";
interface GetServiceProps {
  queryKey: any;
  filterDate: any;
}

export const useGetServiceQuery = () => {
  const { data: shops } = useGerBraches();
  const { data: user } = useCurrentUser();
  const year = new Date().getFullYear();
  const [date, setDate] = useQueryState(
    "date",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd"))
  );

  const [branch, setBranch] = useQueryState(
    "branch",
    parseAsString.withDefault("1")
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
  const branchId =
    user?.role === "admin"
      ? shops?.find((shop) => shop.branchNumber.toString() === branch)?.id
      : user?.branchId;

  return useQuery<Service[]>({
    queryKey: ["GetServices", startDate, endDate, date, filterMode, branch],
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
            branchId,
          },
        })
        .then((res) => res.data);
    },
  });
};

export const useGetSingleService = () => {
  const { id } = useParams();
  return useQuery<Service>({
    queryKey: ["GetService"],
    queryFn: async () => {
      return api.get(`/services/${id}`).then((res) => res.data);
    },
  });
};
