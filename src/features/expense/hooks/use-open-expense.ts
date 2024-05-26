import { create } from "zustand";

type OpenExpenseState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useOpenExpense = create<OpenExpenseState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
