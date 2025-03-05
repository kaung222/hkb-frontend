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
import { SUCCESS_MSG } from "@/constants/general.const";
import { parseAsString, useQueryState } from "nuqs";

const ItemDialog: React.FC = () => {
  const { selectedItem, dialogOpen, setDialogOpen } = useInventoryStore();
  const { mutate: saveItem } = useSaveItemMutation();
  const [branch] = useQueryState("branch", parseAsString.withDefault("all"));

  const [itemDetails, setItemDetails] = useState({
    user: "Aung Min Thann", // Replace with actual user data
    itemCode: "",
    itemName: "",
    lot: "",
    category: "T+L",
    purchasePrice: null,
    sellPrice: null,
    note: "",
    branch: branch === "all" ? ["all"] : branch,
  });

  useEffect(() => {
    if (selectedItem) {
      setItemDetails(selectedItem);
    } else {
      setItemDetails({
        user: "Aung Min Thann", // Replace with actual user data
        itemCode: "",
        itemName: "",
        lot: "",
        category: "T+L",
        purchasePrice: null,
        sellPrice: null,
        note: "",
        branch: branch === "all" ? ["all"] : branch,
      });
    }
  }, [selectedItem]);

  const handleSave = () => {
    if (!itemDetails.itemCode) {
      toast.error("Item Code is required");
      return;
    }
    if (!itemDetails.itemName) {
      toast.error("Item Name is required");
      return;
    }

    saveItem(
      {
        ...itemDetails,
        branch: Array.isArray(itemDetails.branch)
          ? itemDetails.branch
          : [itemDetails.branch], // Ensure branch is always an array
      },
      {
        onSuccess: () => {
          toast.success(SUCCESS_MSG);
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error(
            error?.message || "An error occurred while saving the item"
          );
        },
      }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedItem ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Item Code"
            value={itemDetails.itemCode}
            onChange={(e) =>
              setItemDetails({ ...itemDetails, itemCode: e.target.value })
            }
          />
          <Input
            placeholder="Item Name"
            value={itemDetails.itemName}
            onChange={(e) =>
              setItemDetails({ ...itemDetails, itemName: e.target.value })
            }
          />
          <Input
            placeholder="Lot No."
            value={itemDetails.lot}
            onChange={(e) =>
              setItemDetails({ ...itemDetails, lot: e.target.value })
            }
          />
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Category
            </label>
            <Select
              value={itemDetails.category}
              onValueChange={(value) =>
                setItemDetails({ ...itemDetails, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T+L">T+L</SelectItem>
                <SelectItem value="Battery">Battery</SelectItem>
                <SelectItem value="Glass">Glass</SelectItem>
                <SelectItem value="Touch">Touch</SelectItem>
                <SelectItem value="LCD">LCD</SelectItem>
                <SelectItem value="Cover">Cover</SelectItem>
                <SelectItem value="BodyCover">Body Cover</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Purchase Price"
            type="number"
            value={itemDetails.purchasePrice}
            onChange={(e) =>
              setItemDetails({
                ...itemDetails,
                purchasePrice: parseFloat(e.target.value),
              })
            }
          />
          <Input
            placeholder="Sell Price"
            type="number"
            value={itemDetails.sellPrice}
            onChange={(e) =>
              setItemDetails({
                ...itemDetails,
                sellPrice: parseFloat(e.target.value),
              })
            }
          />
          <Input
            placeholder="Note"
            value={itemDetails.note}
            onChange={(e) =>
              setItemDetails({ ...itemDetails, note: e.target.value })
            }
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {selectedItem ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;
