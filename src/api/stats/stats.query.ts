import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { parseAsString, useQueryState } from "nuqs";
import { startOfMonth } from "date-fns";
import { useGerBraches } from "../branch/branch.query";
import { useCurrentUser } from "../user/current-user";

interface IncomeSummary {
  totalServices: string;
  totalPrice: string;
  totalProfit: string;
  totalExpense: string;
}
export type MonthlyReport = {
  totalIncome: IncomeSummary;
  previousMonth: IncomeSummary;
  nextMonth: IncomeSummary;
};

export const useStatistics = () => {
  const year = new Date().getFullYear();
  const [month, setMonth] = useQueryState(
    "month",
    parseAsString.withDefault("01")
  );
  const [branch, setBranch] = useQueryState("branch");
  const { data: shops } = useGerBraches();
  const { data: user } = useCurrentUser();

  const branchId =
    user?.role === "admin"
      ? shops?.find((shop) => shop.branchNumber.toString() === branch)?.id
      : user?.branchId;

  const startDate = startOfMonth(new Date(year, parseInt(month) - 1));
  const endDate = startOfMonth(new Date(year, parseInt(month)));
  return useQuery<MonthlyReport>({
    queryKey: ["Statistics", month, branch],
    queryFn: async () => {
      return await api
        .get("/services/stats/all", {
          params: { startDate, endDate, branchId },
        })
        .then((res) => res.data);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
