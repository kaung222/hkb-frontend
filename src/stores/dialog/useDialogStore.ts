import { create } from "zustand";

interface DialogState {
  dialogs: Record<string, boolean>; // Tracks dialog states by key
  openDialog: (key: string) => void;
  closeDialog: (key: string) => void;
  toggleDialog: (key: string) => void;
  handleDialogChange: (key: string, isOpen: boolean) => void; // Encapsulates the open/close logic
  isOpen: (key: string) => boolean;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  dialogs: {},
  openDialog: (key) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: true },
    })),
  closeDialog: (key) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: false },
    })),
  toggleDialog: (key) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: !state.dialogs[key] },
    })),
  handleDialogChange: (key, isOpen) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: isOpen },
    })),
  isOpen: (key) => get().dialogs[key] || false,
}));
