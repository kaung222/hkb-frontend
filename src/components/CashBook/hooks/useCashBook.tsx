import {
  useCashMutation,
  useDebtMutation,
} from "@/api/cashbook/cashbook.mutation";
import {
  useGetCashQuery,
  useGetDebtQuery,
} from "@/api/cashbook/cashbook.query";
import { CashItem, DebtItem } from "@/types/cashbook";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "@uidotdev/usehooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ERROR_MSG, SUCCESS_MSG } from "@/constants/general.const";

const CashBookFormSchema = z.object({
  filterDate: z.string(),
  branch: z.string(),
  search: z.string(),
  sortByItem: z.string(),
});

type CashBookFormValues = z.infer<typeof CashBookFormSchema>;

const useCashBook = (initialFilterDate = "today", initialBranch = "all") => {
  const [creditList, setCreditList] = useState(false);
  const [debtDetail, setDebtDetail] = useState<DebtItem | null>(null);

  const form = useForm<CashBookFormValues>({
    resolver: zodResolver(CashBookFormSchema),
    defaultValues: {
      filterDate: initialFilterDate,
      branch: initialBranch,
      search: "",
      sortByItem: "date",
    },
  });

  const searchTerm = form.watch("search");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { filterDate, branch, sortByItem } = form.getValues();

  const { data: cash = [], isLoading: cashLoading } = useGetCashQuery({
    queryKey: ["cash", filterDate, branch],
    filterDate,
    branch,
  });

  const { data: debt = [], isLoading: debtLoading } = useGetDebtQuery({
    queryKey: ["debt", filterDate, branch],
    filterDate,
    branch,
  });

  const cashMutation = useCashMutation();
  const debtMutation = useDebtMutation();

  const toggleCreditList = () => setCreditList((prev) => !prev);

  const updateCashDetail = async (cashDetail: CashItem) => {
    await cashMutation.mutateAsync(cashDetail);
  };

  const updateDebtDetail = async (debtDetail: DebtItem) => {
    await debtMutation.mutateAsync(debtDetail, {
      onSuccess: () => toast.success(SUCCESS_MSG),
      onError: () => toast.error(ERROR_MSG),
    });
    setDebtDetail(null);
  };

  const totals = useMemo(() => {
    if (creditList) {
      return {
        totalDebt: debt.reduce((acc, item) => acc + item.payyan, 0),
        totalCredit: debt.reduce((acc, item) => acc + item.yayan, 0),
      };
    }
    return {
      totalService: cash.reduce((acc, item) => acc + item.service, 0),
      totalPurchase: cash.reduce((acc, item) => acc + item.purchase, 0),
      totalSale: cash.reduce((acc, item) => acc + item.sale, 0),
      totalGeneralExpense: cash.reduce(
        (acc, item) => acc + item.generalExpense,
        0
      ),
      totalAdjust: cash.reduce((acc, item) => acc + item.adjust, 0),
    };
  }, [creditList, cash, debt]);

  const filteredCash = useMemo(() => {
    if (debouncedSearchTerm.length < 3) return cash;
    const lowerSearchKey = debouncedSearchTerm.toLowerCase();
    return cash.filter((obj) =>
      Object.keys(obj).some((key) =>
        obj[key]?.toString().toLowerCase().includes(lowerSearchKey)
      )
    );
  }, [cash, debouncedSearchTerm]);

  const filteredDebt = useMemo(() => {
    if (debouncedSearchTerm.length < 3) return debt;
    const lowerSearchKey = debouncedSearchTerm.toLowerCase();
    return debt.filter((obj) =>
      Object.keys(obj).some((key) =>
        obj[key]?.toString().toLowerCase().includes(lowerSearchKey)
      )
    );
  }, [debt, debouncedSearchTerm]);

  return {
    loading: cashLoading || debtLoading,
    filterDate,
    setFilterDate: (date) => form.setValue("filterDate", date),
    branch,
    setBranch: (branch) => form.setValue("branch", branch),
    cash: filteredCash,
    debt: filteredDebt,
    creditList,
    toggleCreditList,
    debtDetail,
    setDebtDetail,
    updateCashDetail,
    updateDebtDetail,
    totals,
    form,
    sortByItem,
    setSortByItem: (item) => form.setValue("sortByItem", item),
  };
};

export default useCashBook;
