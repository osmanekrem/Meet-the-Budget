import { convertMiliUnitstoAmount } from "@/lib/utils";
import { CreateVault, Expense, Income, Vault } from "@/types/app-types";
import { create } from "zustand";
import { VaultFormValues } from "../components/vault-form";
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from "sonner";

type VaultState = {
  vaults: Vault[];
  getVault: (id?: number) => Vault | undefined;
  getVaults: (ids: "all" | number[]) => Vault[];
  getVaultFormValues: (id?: number) => VaultFormValues | undefined;
  getExpendableVaults: () => Vault[];
  addVault: (vault: CreateVault) => void;
  editVault: (id: number, vault: CreateVault | Vault) => void;
  removeVault: (id: number) => void;
  removeVaults: (ids: number[]) => void;
  addIncomeToVault: (id: number, income: Income & { id: number }) => void;
  removeIncomeFromVault: (id: number, incomeId: number) => void;
  removeIncomesFromVault: (id: number, incomeIds: number[]) => void;
  editIncomeInVault: (id: number, income: Income & { id: number }) => void;
  addExpenseToVault: (id: number, expense: Expense & { id: number }) => void;
  removeExpenseFromVault: (id: number, expenseId: number) => void;
  removeExpensesFromVault: (id: number, expenseId: number[]) => void;
  editExpenseInVault: (id: number, expense: Expense & { id: number }) => void;
};

export const useVault = create<VaultState>()(
  persist(
    (set, get) => ({
      vaults: [
        {
          id: 1,
          isExpendable: true,
          initialMoney: 0,
          name: "Main Vault",
          incomes: [],
          expenses: [],
        },
      ],
      getVault: (id) => get().vaults.find((vault) => vault.id === id),
      getVaults: (ids) =>
        ids === "all"
          ? get().vaults
          : get().vaults.filter((vault) => ids.includes(vault.id)),
      getVaultFormValues: (id) => {
        const vault = get().vaults.find((vault) => vault.id === id);
        return vault
          ? {
              ...vault,
              initialMoney: convertMiliUnitstoAmount(
                vault.initialMoney
              ).toString(),
            }
          : undefined;
      },
      getExpendableVaults: () => get().vaults.filter((v) => v.isExpendable),
      addVault: (vault) =>
        {set((state) => ({
          vaults: [
            ...state.vaults,
            {
              ...vault,
              id: state.vaults.length + 1,
              incomes: [],
              expenses: [],
            },
          ],
        }))
        toast.success("Vault Created!")
      },
      editVault: (id, vault) =>
        set((state) => ({
          vaults: [
            ...state.vaults.map((i) =>
              i.id === id
                ? { ...vault, id: id, incomes: i.incomes, expenses: i.expenses }
                : i
            ),
          ],
        })),
      removeVault: (id) =>
        set((state) => ({
          vaults: state.vaults.filter(
            (vault) => vault.id !== id || vault.id === 1
          ),
        })),
      removeVaults: (ids) =>
        set((state) => ({
          vaults: state.vaults.filter(
            (vault) => !ids.includes(vault.id) || vault.id === 1
          ),
        })),
      addIncomeToVault: (id, income) =>
        set((state) => ({
          vaults: state.vaults.map((v) =>
            v.id === id ? { ...v, incomes: [...v.incomes, income] } : v
          ),
        })),
      removeIncomeFromVault: (id, incomeId) =>
        set((state) => ({
          vaults: state.vaults.map((v) =>
            v.id === id
              ? {
                  ...v,
                  incomes: v.incomes.filter((income) => income.id !== incomeId),
                }
              : v
          ),
        })),
      editIncomeInVault: (id, income) =>
        set((state) => ({
          vaults: state.vaults.map((v) =>
            v.id === id
              ? {
                  ...v,
                  incomes: v.incomes.map((i) =>
                    i.id === income.id ? income : i
                  ),
                }
              : v
          ),
        })),
      removeIncomesFromVault: (id, incomeIds) =>
        set((state) => ({
          vaults: state.vaults.map((v) =>
            v.id === id
              ? {
                  ...v,
                  incomes: v.incomes.filter(
                    (income) => !incomeIds.includes(income.id)
                  ),
                }
              : v
          ),
        })),
      addExpenseToVault: (id, expense) =>
        set((state) => ({
          vaults: state.vaults.map((v) =>
            v.id === id ? { ...v, expenses: [...v.expenses, expense] } : v
          ),
        })),
      removeExpenseFromVault: (id, expenseId) =>
        set((state) => ({
          vaults: state.vaults.map((v) =>
            v.id === id
              ? {
                  ...v,
                  expenses: v.expenses.filter(
                    (expense) => expense.id !== expenseId
                  ),
                }
              : v
          ),
        })),
      removeExpensesFromVault: (id, expenseIds) =>
        set((state) => ({
          vaults: state.vaults.map((v) =>
            v.id === id
              ? {
                  ...v,
                  expenses: v.expenses.filter(
                    (expense) => !expenseIds.includes(expense.id)
                  ),
                }
              : v
          ),
        })),
      editExpenseInVault: (id, expense) =>
        set((state) => ({
          vaults: state.vaults.map((v) =>
            v.id === id
              ? {
                  ...v,
                  expenses: v.expenses.map((i) =>
                    i.id === expense.id ? expense : i
                  ),
                }
              : v
          ),
        })),
    }),
    {
      name: "vault-storage",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
