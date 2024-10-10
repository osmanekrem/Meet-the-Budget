
import { convertMiliUnitstoAmount } from "@/lib/utils";
import { CreateTransfer, Frequency, Transfer } from "@/types/app-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TransferFormValues } from "../components/transfer-form";

type TransferState = {
  transfers: Transfer[];
  getTransfer: (id?: number) => TransferFormValues | undefined;
  getTransferWithValues: (id?: number) => Transfer | undefined;
  addTransfer: (transfer: CreateTransfer) => Transfer;
  editTransfer: (id: number, transfer: CreateTransfer) => void;
  removeTransfer: (id: number) => void;
  removeTransfers: (ids: number[]) => void;
};

export const useTransfer = create<TransferState>()(
  persist(
    (set, get) => ({
      transfers: [],
      getTransfer: (id) => {
        const transfer = get().transfers.find((transfer) => transfer.id === id);
        return transfer
          ? {
              name: transfer.name,
              frequency: transfer.frequency,
              fromVaultId: transfer.from.id,
              toVaultId: transfer.to.id,
              startDay: transfer.startDay,
              duration: transfer.duration,
              amount: convertMiliUnitstoAmount(transfer.amount).toString(),
              ...(transfer.frequencyOfChange === Frequency.NEVER
                ? {
                    frequencyOfChange: Frequency.NEVER,
                  }
                : {
                    frequencyOfChange: transfer.frequencyOfChange,
                    amountOfChange: transfer.isPercentageChange
                      ? transfer.amountOfChange.toString()
                      : convertMiliUnitstoAmount(
                          transfer.amountOfChange
                        ).toString(),
                    isPercentageChange: transfer.isPercentageChange,
                  }),
            }
          : undefined;
      },
      getTransferWithValues:(id)=> {
          return get().transfers.find(transfer => transfer.id === id)
      },
      addTransfer: (transfer) => {
        const data = { ...transfer, id: get().transfers.length + 1 };
        set((state) => ({
          transfers: [...state.transfers, data],
        }));
        return data;
      },
      editTransfer: (id, transfer) =>
        set((state) => ({
          transfers: [
            ...state.transfers.map((i) =>
              i.id === id ? {id, ...transfer} : i
            ),
          ],
        })),
      removeTransfer: (id) =>
        set((state) => ({
          transfers: state.transfers.filter((transfer) => transfer.id !== id),
        })),
      removeTransfers: (ids) =>
        set((state) => ({
          transfers: state.transfers.filter((transfer) => !ids.includes(transfer.id)),
        })),
    }),
    {
      name: "transfer-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
