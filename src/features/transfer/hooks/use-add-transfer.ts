import { create } from "zustand";

type AddTransferState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddTransfer = create<AddTransferState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
