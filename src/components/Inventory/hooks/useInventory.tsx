import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const InventorySchema = z.object({
  filterDate: z.string(),
  branch: z.string(),
  search: z.string(),
});

type InventoryFormValues = z.infer<typeof InventorySchema>;

const useInventory = () => {
  const [screen, setScreen] = useState<string>("Stock");

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      filterDate: "today",
      branch: "all",
      search: "",
    },
  });

  const totals = {
    items: 100,
    value: 5000,
  };

  return {
    form,
    screen,
    setScreen,
    filterDate: form.watch("filterDate"),
    branch: form.watch("branch"),
    totals,
  };
};


export default useInventory