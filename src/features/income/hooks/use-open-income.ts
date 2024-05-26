import { create } from "zustand";

type OpenIncomeState = {
  id?: number;
  isOpen: boolean;
  onOpen: (id: number) => void;
  onClose: () => void;
};

export const useOpenIncome = create<OpenIncomeState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
