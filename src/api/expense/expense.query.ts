import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { ExpensesResponse } from "@/types/expense";
import { parseAsString, useQueryState } from "nuqs";
import { addDays, format, startOfMonth } from "date-fns";
import { useGerBraches } from "../branch/branch.query";
import { useCurrentUser } from "../user/current-user";

export const useGetExpenses = () => {
  const { data: shops } = useGerBraches();
  const { data: user } = useCurrentUser();

  const [date] = useQueryState(
    "date",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd"))
  );
  const [branch] = useQueryState("branch", parseAsString.withDefault("1"));
  const [month] = useQueryState("month", parseAsString.withDefault("01"));
  const [year] = useQueryState(
    "year",
    parseAsString.withDefault(new Date().getFullYear().toString())
  );
  const [filterMode] = useQueryState(
    "filterMode",
    parseAsString.withDefault("day")
  );
  const [page] = useQueryState("page", parseAsString.withDefault("1"));

  const selectedYear = parseInt(year);
  const startDate = startOfMonth(new Date(selectedYear, parseInt(month) - 1));
  const endDate = startOfMonth(new Date(selectedYear, parseInt(month)));

  // non-admin users are locked to their own branch
  const branchId =
    user?.role === "admin"
      ? shops?.find((shop) => shop.branchNumber.toString() === branch)?.id
      : user?.branchId;

  const computedStartDate =
    filterMode === "day" ? date : format(startDate, "yyyy-MM-dd");
  const computedEndDate =
    filterMode === "day"
      ? format(addDays(new Date(date), 1), "yyyy-MM-dd")
      : format(endDate, "yyyy-MM-dd");

  return useQuery<ExpensesResponse>({
    queryKey: [
      "GetExpenses",
      computedStartDate,
      computedEndDate,
      branchId,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (branchId) {
        params.append("branchId", branchId.toString());
      }

      params.append("startDate", computedStartDate);
      params.append("endDate", computedEndDate);
      params.append("page", page);

      const queryString = params.toString();
      const url = queryString ? `expenses?${queryString}` : "expenses";

      return await api.get(url).then((res) => res.data);
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
