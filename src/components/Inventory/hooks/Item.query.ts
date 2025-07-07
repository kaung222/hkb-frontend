import api from "@/api/api";
import { useGerBraches } from "@/api/branch/branch.query";
import { useCurrentUser } from "@/api/user/current-user";
import { Item } from "@/types/inventory";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";

export const useGetItem = () => {
  const { data: user } = useCurrentUser();
  const { data: shops } = useGerBraches();
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

  const branchId =
    user?.role === "admin"
      ? shops?.find((shop) => shop.branchNumber.toString() === branch)?.id
      : user?.branchId;
  return useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      return await api.get(`/items`, {
        params: { startDate, endDate, branchId },
      });
    },
  });
};
