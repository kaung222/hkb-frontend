import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VirtualizedTable from "@/components/common/VirtualizedTable";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface PurchaseData {
  id: string;
  date: string;
  branch: string;
  voucher: string;
  itemCode: string;
  itemName: string;
  lot: string;
  user: string;
  supplier: string;
  payment: string;
  qty: number;
  amount: number;
  discount: number;
  tax: number;
  paid: number;
  total: number;
  remain: number;
  damage: number;
}

const PurchaseTable: React.FC = () => {
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([]); // Fetch or initialize your data here
  const [search, setSearch] = useState("");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseData | null>(
    null
  );

  const handleAddNew = () => {
    setSelectedPurchase(null);
    setShowAddEditModal(true);
  };

  const handleEdit = (purchase: PurchaseData) => {
    setSelectedPurchase(purchase);
    setShowAddEditModal(true);
  };

  const handleDelete = (id: string) => {
    setPurchaseData((prev) => prev.filter((purchase) => purchase.id !== id));
  };

  const filteredData = purchaseData.filter((purchase) =>
    Object.values(purchase).some((val) =>
      val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    { label: "Date", renderCell: (item: PurchaseData) => item.date },
    { label: "Branch", renderCell: (item: PurchaseData) => item.branch },
    { label: "Voucher", renderCell: (item: PurchaseData) => item.voucher },
    { label: "Item Code", renderCell: (item: PurchaseData) => item.itemCode },
    { label: "Item Name", renderCell: (item: PurchaseData) => item.itemName },
    { label: "Lot", renderCell: (item: PurchaseData) => item.lot },
    { label: "User", renderCell: (item: PurchaseData) => item.user },
    { label: "Supplier", renderCell: (item: PurchaseData) => item.supplier },
    { label: "Qty", renderCell: (item: PurchaseData) => item.qty },
    { label: "Amount", renderCell: (item: PurchaseData) => item.amount },
    { label: "Paid", renderCell: (item: PurchaseData) => item.paid },
    {
      label: "Actions",
      renderCell: (item: PurchaseData) => (
        <div>
          <Button onClick={() => handleEdit(item)}>Edit</Button>
          <Button variant="destructive" onClick={() => handleDelete(item.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search Purchases"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleAddNew}>Add New</Button>
      </div>

      <VirtualizedTable
        data={filteredData}
        columns={columns}
        rowKey={(item) => item.id}
        onRowClick={(item) => handleEdit(item)}
      />

      <Dialog open={showAddEditModal} onOpenChange={setShowAddEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPurchase ? "Edit Purchase" : "Add New Purchase"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Voucher"
              defaultValue={selectedPurchase?.voucher || ""}
              onChange={(e) =>
                setSelectedPurchase({
                  ...selectedPurchase!,
                  voucher: e.target.value,
                })
              }
            />
            <Input
              placeholder="Supplier"
              defaultValue={selectedPurchase?.supplier || ""}
              onChange={(e) =>
                setSelectedPurchase({
                  ...selectedPurchase!,
                  supplier: e.target.value,
                })
              }
            />
            <Input
              placeholder="Amount"
              type="number"
              defaultValue={selectedPurchase?.amount.toString() || ""}
              onChange={(e) =>
                setSelectedPurchase({
                  ...selectedPurchase!,
                  amount: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAddEditModal(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (selectedPurchase) {
                  setPurchaseData((prev) =>
                    prev.map((purchase) =>
                      purchase.id === selectedPurchase.id
                        ? selectedPurchase
                        : purchase
                    )
                  );
                } else {
                  const newPurchase = {
                    id: `${Math.random()}`,
                    date: "",
                    branch: "",
                    voucher: "",
                    itemCode: "",
                    itemName: "",
                    lot: "",
                    user: "",
                    supplier: "",
                    payment: "",
                    qty: 0,
                    amount: 0,
                    discount: 0,
                    tax: 0,
                    paid: 0,
                    total: 0,
                    remain: 0,
                    damage: 0,
                  };
                  setPurchaseData((prev) => [...prev, newPurchase]);
                }
                setShowAddEditModal(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseTable;
