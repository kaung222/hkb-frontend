import { DebtItem } from "@/types/cashbook";
import { create } from "zustand";

interface DialogStore {
  debtDetail: DebtItem | null;
  dialogOpen: boolean;
  setDebtDetail: (detail: DebtItem) => void;
  setDialogOpen: (open: boolean) => void;
  resetDialog: () => void;
}

const useDebtDialogStore = create<DialogStore>((set) => ({
  debtDetail: null,
  dialogOpen: false,

  setDebtDetail: (detail) => set({ debtDetail: detail }),
  setDialogOpen: (open) => set({ dialogOpen: open }),
  resetDialog: () => set({ debtDetail: null, dialogOpen: false }),
}));

export default useDebtDialogStore;
