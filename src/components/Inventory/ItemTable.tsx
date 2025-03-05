import React, { useEffect } from "react";
import useInventoryStore from "@/stores/inventory/useInventoryStore";
import VirtualizedTable from "@/components/common/VirtualizedTable";
import { useGetItemsQuery } from "@/api/inventory/inventory.query";
import { Button } from "@/components/ui/button";
import ItemDialog from "./ItemDialog";
import { toast } from "sonner";
import { SUCCESS_MSG } from "@/constants/general.const";
import { useSaveItemMutation } from "@/api/inventory/inventory.mutation";
import { parseAsString, useQueryState } from "nuqs";

const ItemTable: React.FC = () => {
  const {
    items,
    setItems,
    search,
    // branch,
    // filterDate,
    setDialogOpen,
    setSelectedItem,
  } = useInventoryStore();
  const [date] = useQueryState("date", parseAsString.withDefault("today"));
  const [branch] = useQueryState("branch", parseAsString.withDefault("all"));
  const { data, isLoading, error } = useGetItemsQuery({
    filterDate: date,
  });

  const { mutate: saveItem } = useSaveItemMutation();

  useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        (item) =>
          (branch === "all" || item.branch === branch) &&
          (date === "today" || true) // Add your custom date filter logic
      );
      setItems(filteredData);
    }
  }, [data, branch, date, setItems]);

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleDelete = async (itemDetails: any) => {
    const payload = {
      ...itemDetails,
      delete: "true",
      branch: branch === "all" ? ["all"] : branch,
    };

    saveItem(payload, {
      onSuccess: () => {
        toast.success(SUCCESS_MSG);
        setDialogOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || "Error occurred while deleting the item");
      },
    });
  };

  const columns = [
    { label: "Branch", renderCell: (item: any) => item.branch },
    { label: "Item Code", renderCell: (item: any) => item.itemCode },
    { label: "Item Name", renderCell: (item: any) => item.itemName },
    { label: "Lot No.", renderCell: (item: any) => item.lot },
    { label: "Category", renderCell: (item: any) => item.category },
    {
      label: "Purchase Price",
      renderCell: (item: any) => `$${item.purchasePrice}`,
    },
    { label: "Sell Price", renderCell: (item: any) => `$${item.sellPrice}` },
    { label: "Input User", renderCell: (item: any) => item.user },
    { label: "Date", renderCell: (item: any) => item.date },
    { label: "Note", renderCell: (item: any) => item.note },
    {
      label: "Actions",
      renderCell: (item: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedItem(item);
              setDialogOpen(true);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(item)} variant="destructive">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button
          onClick={() => {
            setSelectedItem(null);
            setDialogOpen(true);
          }}
        >
          Add New Item
        </Button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading items.</p>}

      <VirtualizedTable
        data={filteredItems}
        columns={columns}
        rowKey={(item) => item.id}
      />

      {/* Add/Edit Item Dialog */}
      <ItemDialog />
    </div>
  );
};

export default ItemTable;
