import React from "react";
import { DebtItem } from "@/types/cashbook";
import useDebtDialogStore from "@/stores/cashbook/useDebtDialogStore";
import VirtualizedTable from "../common/VirtualizedTable";
import { format, parse } from "date-fns";

interface DebtTableProps {
  debt: DebtItem[];
}

const DebtTable: React.FC<DebtTableProps> = ({ debt }) => {
  const { setDebtDetail, setDialogOpen } = useDebtDialogStore();

  const handleRowClick = (item: DebtItem) => {
    setDialogOpen(true);
    setDebtDetail(item);
  };

  const columns = [
    {
      label: "ရက်စွဲ",
      width: "",
      renderCell: (item: DebtItem) =>
        format(
          parse(item.date, "yyyy-MM-dd HH:mm:ss", new Date()),
          "MMMM d, yyyy 'at' hh:mm a"
        ),
    },
    {
      label: "ဆိုင်ခွဲ",
      width: "",
      renderCell: (item: DebtItem) => item.branch,
    },
    { label: "အမည်", width: "", renderCell: (item: DebtItem) => item.name },
    {
      label: "ဘောက်ချာနံပါတ်",
      width: "",
      renderCell: (item: DebtItem) => item.voucher,
    },
    {
      label: "အကြောင်းအရာ",
      width: "",
      renderCell: (item: DebtItem) => item.description,
    },
    {
      label: "ပေးရန်ကျန်ငွေ",
      width: "",
      renderCell: (item: DebtItem) => item.payyan.toString(),
    },
    {
      label: "ရရန်ကျန်ငွေ",
      width: "",
      renderCell: (item: DebtItem) => item.yayan.toString(),
    },
  ];

  return (
    <div className="mt-2">
      <VirtualizedTable
        data={debt}
        columns={columns}
        rowKey={(item) => item.id}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default DebtTable;
