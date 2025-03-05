import React, { useEffect } from "react";
import VirtualizedTable from "@/components/common/VirtualizedTable";
import useInventoryStore from "@/stores/inventory/useInventoryStore";
import { useGetSalesQuery } from "@/api/inventory/inventory.query";
import useSaleStore from "@/stores/inventory/useSaleStore";
import { Button } from "../ui/button";
import SaleDialog from "./SaleDialog";
import { parseAsString, useQueryState } from "nuqs";

const SaleTable: React.FC = () => {
  const { search, setDialogOpen } = useInventoryStore();
  const { sales, setSales } = useSaleStore();
  const [branch] = useQueryState("branch", parseAsString.withDefault("all"));
  const [date] = useQueryState("date", parseAsString.withDefault("today"));
  const { data, isLoading, error } = useGetSalesQuery({ filterDate: date });

  useEffect(() => {
    if (data) {
      const filteredSales = data?.filter(
        (sale) =>
          (branch === "all" || sale.branch === branch) &&
          (date === "today" || true) // Add your custom date filter logic
      );
      setSales(filteredSales);
    }
  }, [data, branch, date, setSales]);

  console.log(data);

  const filteredSales = sales.filter((sale) =>
    Object.values(sale).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      label: "ရက်စွဲ",
      renderCell: (sale: any) => sale.date,
    },
    {
      label: "ဆိုင်ခွဲ",
      renderCell: (sale: any) => sale.branch,
    },
    {
      label: "ဘောက်ချာ",
      renderCell: (sale: any) => sale.voucher,
    },
    {
      label: "ကုတ်",
      renderCell: (sale: any) => sale.itemCode,
    },
    {
      label: "ပစ္စည်းအမည်",
      renderCell: (sale: any) => sale.itemName,
    },
    {
      label: "လော့နံပါတ်",
      renderCell: (sale: any) => sale.lot,
    },
    {
      label: "User",
      renderCell: (sale: any) => sale.user,
    },
    {
      label: "ဖောက်သည်",
      renderCell: (sale: any) => sale.customer,
    },
    {
      label: "ငွေချေပုံ",
      renderCell: (sale: any) => sale.payment,
    },
    {
      label: "Qty",
      renderCell: (sale: any) => sale.qty,
    },
    {
      label: "နှုန်း",
      renderCell: (sale: any) => sale.amount,
    },
    {
      label: "လျော့ငွေ",
      renderCell: (sale: any) => sale.discount,
    },
    {
      label: "အခွန်",
      renderCell: (sale: any) => sale.tax,
    },
    {
      label: "ပေးငွေ",
      renderCell: (sale: any) => sale.paid,
    },
    {
      label: "စုစုပေါင်း",
      renderCell: (sale: any) => sale.total,
    },
    {
      label: "ကျန်ငွေ",
      renderCell: (sale: any) => sale.remain,
    },
    {
      label: "အပျက်/ပြန်လဲ",
      renderCell: (sale: any) => sale.damage,
    },
  ];

  const handleEdit = (sale: any) => {
    console.log("Edit Sale:", sale);
  };

  const handleDelete = (id: string) => {
    console.log("Delete Sale ID:", id);
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading sales.</p>}
      <div className="flex justify-between mb-4">
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          Add Sale
        </Button>
      </div>
      <VirtualizedTable
        data={filteredSales}
        columns={columns}
        rowKey={(sale) => sale.id}
      />

      <SaleDialog />
    </div>
  );
};

export default SaleTable;
