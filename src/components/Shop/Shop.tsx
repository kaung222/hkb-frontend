"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ShopFormData, ShopSchema } from "./schema/ShopSchema";
import { useDialogStore } from "@/stores/dialog/useDialogStore";
import { dialogKeys } from "@/constants/general.const";
import ShopDialog from "./ShopDialog";
import { PlusCircleIcon } from "lucide-react";
import VirtualizedTable from "../common/VirtualizedTable";
import { Branch } from "@/types/branch";
import { useGerBraches } from "@/api/branch/branch.query";
import { useCreateBranch, useDeleteBranch } from "@/api/branch/branch.mutation";

const Shop = () => {
  const { data: shops, isLoading, error } = useGerBraches();
  const { openDialog, closeDialog } = useDialogStore();
  const [dialogKey, setDialogKey] = useState("");
  const { mutate } = useCreateBranch();
  const { mutate: deleteBranch } = useDeleteBranch();

  const form = useForm<ShopFormData>({
    resolver: zodResolver(ShopSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  });

  const onSubmit = async (data: ShopFormData) => {
    try {
      console.log("here", data);
      mutate(data);
      closeDialog(dialogKey);
    } catch (err) {
      console.error("Error saving shop:", err);
    }
  };

  const handleEdit = (shop: any) => {
    console.log(shop);
  };

  const handleDelete = async (id: number) => {
    try {
      // delete shop
      deleteBranch({ id: id.toString() });
    } catch (err) {
      console.error("Error deleting shop:", err);
    }
  };

  const columns = [
    {
      label: "Name",
      renderCell: (shop: Branch) => shop.name,
    },
    {
      label: "Branch",
      renderCell: (shop: Branch) => shop.name,
    },
    {
      label: "Phone Number",
      renderCell: (shop: Branch) => shop.phone,
    },
    {
      label: "Address",
      renderCell: (shop: Branch) => shop.address,
    },
    {
      label: "Actions",
      renderCell: (shop: Branch) => (
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setDialogKey(dialogKeys.editShop);
              handleEdit(shop);
              openDialog(dialogKeys.editShop);
            }}
          >
            Edit
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(shop.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto p-8">
      {/* Shop Form */}
      <Button
        variant="outline"
        onClick={() => {
          setDialogKey(dialogKeys.addNewShop);
          openDialog(dialogKeys.addNewShop);
        }}
      >
        <PlusCircleIcon />
        Add new shop
      </Button>

      <div className="mt-5">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : shops && shops.length > 0 ? (
          <VirtualizedTable
            data={shops}
            columns={columns}
            rowKey={(shop) => shop.id}
            onRowClick={(shop) => console.log("Row clicked:", shop)}
          />
        ) : (
          <p>No shops available.</p>
        )}
      </div>

      <ShopDialog form={form} onSubmit={onSubmit} dialogKey={dialogKey} />
    </div>
  );
};

export default Shop;
