import { Item, Sale } from "@/types/inventory";
import { create } from "zustand";

interface InventoryState {
  // filterDate: string;
  // branch: string;
  search: string;
  items: Item[];
  sales: Sale[];
  screen: string;
  selectedItem: Item;
  selectedSale: Sale;
  dialogOpen: boolean;
  // setFilterDate: (filterDate: string) => void;
  // setBranch: (branch: string) => void;
  setSearch: (search: string) => void;
  setItems: (items: any[]) => void;
  setScreen: (screen: string) => void;
  setSelectedItem: (item: Item) => void;
  setDialogOpen: (open: boolean) => void;
  setSelectedSale: (sale: Sale) => void;
}

const useInventoryStore = create<InventoryState>((set) => ({
  // filterDate: "today",
  // branch: "all",
  search: "",
  items: [],
  sales: [],
  screen: "Item",
  selectedItem: null,
  selectedSale: null,
  dialogOpen: false,
  // setFilterDate: (filterDate) => set({ filterDate }),
  setScreen: (screen) => set({ screen }),
  // setBranch: (branch) => set({ branch }),
  setSearch: (search) => set({ search }),
  setItems: (items) => set({ items }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  setSelectedSale: (sale) => set({ selectedSale: sale }),
  setDialogOpen: (open) => set({ dialogOpen: open }),
}));

export default useInventoryStore;
