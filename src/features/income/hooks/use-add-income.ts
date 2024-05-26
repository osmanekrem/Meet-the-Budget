import { create } from "zustand";

type AddIncomeState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddIncome = create<AddIncomeState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
