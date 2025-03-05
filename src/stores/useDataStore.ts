import { create } from "zustand";

interface DataStore<T> {
  data: T | null;
  setData: (newData: T) => void;
  clearData: () => void;
}

export const useDataStore = create<DataStore<any>>((set) => ({
  data: null,
  setData: (newData) => set({ data: newData }),
  clearData: () => set({ data: null }),
}));
