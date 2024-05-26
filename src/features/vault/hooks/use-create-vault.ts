import { create } from "zustand";

type CreateVaultState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCreateVault = create<CreateVaultState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
