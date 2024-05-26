import { create } from "zustand";

type AddExpenseState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddExpense = create<AddExpenseState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
