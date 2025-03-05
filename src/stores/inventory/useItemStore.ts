import { Item } from "@/types/inventory";
import { create } from "zustand";

interface ItemStore {
  items: Item[];
  filterDate: string;
  search: string;
  sortBy: keyof Item;
  setItems: (items: Item[]) => void;
  setFilterDate: (date: string) => void;
  setSearch: (query: string) => void;
  setSortBy: (key: keyof Item) => void;
}

const useItemStore = create<ItemStore>((set) => ({
  items: [],
  filterDate: "today",
  search: "",
  sortBy: "date",
  setItems: (items) => set({ items }),
  setFilterDate: (filterDate) => set({ filterDate }),
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy }),
}));

export default useItemStore;
