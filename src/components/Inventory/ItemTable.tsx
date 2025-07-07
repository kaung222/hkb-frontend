import React from "react";
import VirtualizedTable from "@/components/common/VirtualizedTable";
import { useGetItemsQuery } from "@/api/inventory/inventory.query";
import { Button } from "@/components/ui/button";
import ItemDialog from "./ItemDialog";
import { toast } from "sonner";
import { SUCCESS_MSG } from "@/constants/general.const";
import { parseAsString, useQueryState } from "nuqs";
import { Item } from "@/types/inventory";
import { format } from "date-fns";
import { useGetItem } from "./hooks/Item.query";
import {
  useCreateItem,
  useDeleteItem,
  useUpdateItem,
} from "./hooks/item.mutation";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { useDataStore } from "@/stores/useDataStore";

const ItemTable: React.FC = () => {
  const { data: items, isLoading, error } = useGetItem();
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: deleteItem } = useDeleteItem();
  const { mutate: saveItem } = useCreateItem();
  const { openDialog } = useDialogStore();
  const { data, setData } = useDataStore();

  const handleDelete = async (item: Item) => {
    deleteItem(item.id, {
      onSuccess: () => {
        toast.success(SUCCESS_MSG);
      },
      onError: (err) => {
        toast.error(err.message || "Error occurred while deleting the item");
      },
    });
  };

  const columns = [
    { label: "Item Code", renderCell: (item: Item) => item.id },
    { label: "Item Name", renderCell: (item: Item) => item.name },

    {
      label: "Item Price",
      renderCell: (item: Item) => `$${item.price}`,
    },
    { label: "Quantity", renderCell: (item: Item) => `$${item.quantity}` },
    { label: "Total Price", renderCell: (item: Item) => item.total },
    {
      label: "Date",
      renderCell: (item: Item) => format(item.createdAt, "YYYY-mm-dd"),
    },
    { label: "Note", renderCell: (item: Item) => item.note },
    {
      label: "Actions",
      renderCell: (item: Item) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(item)} variant="destructive">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleCreateItem = () => {
    // Open the dialog to add a new item
    setData("createItem");
    openDialog("createItem");
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button onClick={() => handleCreateItem()}>Add New Item</Button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading items.</p>}
      {/* 
      <VirtualizedTable
        data={items}
        columns={columns}
        rowKey={(item) => item.id}
      /> */}

      {/* Add/Edit Item Dialog */}
      <ItemDialog />
    </div>
  );
};

export default ItemTable;
