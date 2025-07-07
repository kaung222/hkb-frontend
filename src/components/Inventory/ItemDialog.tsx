import React, { useState, useEffect } from "react";
import useInventoryStore from "@/stores/inventory/useInventoryStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSaveItemMutation } from "@/api/inventory/inventory.mutation";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { dialogKeys, SUCCESS_MSG } from "@/constants/general.const";
import { parseAsString, useQueryState } from "nuqs";
import { useCurrentUser } from "@/api/user/current-user";
import { useDataStore } from "@/stores/useDataStore";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { Item } from "@/types/inventory";
import { useCreateItem } from "./hooks/item.mutation";

const ItemDialog: React.FC = ({
  form,
  dialogKey,
}: {
  form: any;
  dialogKey: string;
}) => {
  const { setData, data } = useDataStore();
  const { data: user } = useCurrentUser();
  const { closeDialog, openDialog, isOpen } = useDialogStore();
  const { mutate: saveItem } = useCreateItem();
  const [dialogOpen, setDialogOpen] = useState(isOpen(dialogKeys.addItem));

  console.log(form, dialogKey);

  const [itemDetails, setItemDetails] = useState<Item>({
    branchId: user?.branchId,
    name: "",
    price: 0,
    quantity: 1,
    total: 0,
    note: "",
    serviceId: undefined,
  });

  useEffect(() => {
    if (data) {
      setItemDetails(data);
    }
  }, [data]);

  const handleSave = () => {
    if (!itemDetails.name) {
      toast.error("Item Code is required");
      return;
    }
    if (!itemDetails.price) {
      toast.error("Item Name is required");
      return;
    }

    saveItem(itemDetails, {
      onSuccess: () => {
        toast.success(SUCCESS_MSG);
        setDialogOpen(false);
      },
      onError: (error) => {
        toast.error(
          error?.message || "An error occurred while saving the item"
        );
      },
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={itemDetails.name}
            onChange={(e) =>
              setItemDetails({ ...itemDetails, name: e.target.value })
            }
          />
          <Input
            placeholder="Price"
            value={itemDetails.price}
            onChange={(e) =>
              setItemDetails({
                ...itemDetails,
                price: parseInt(e.target.value),
              })
            }
          />
          <Input
            placeholder="Quantity"
            value={itemDetails.quantity}
            onChange={(e) =>
              setItemDetails({
                ...itemDetails,
                quantity: parseInt(e.target.value),
              })
            }
          />

          <Input
            placeholder="Purchase Price"
            type="number"
            value={itemDetails.total}
            onChange={(e) =>
              setItemDetails({
                ...itemDetails,
                total: parseFloat(e.target.value),
              })
            }
          />
          <Input
            placeholder="Note"
            type="text"
            value={itemDetails.note}
            onChange={(e) =>
              setItemDetails({
                ...itemDetails,
                note: e.target.value,
              })
            }
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{data ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;
