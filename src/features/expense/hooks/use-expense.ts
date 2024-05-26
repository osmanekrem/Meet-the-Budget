import { ExpenseFormValues } from "@/features/expense/components/expense-form";
import { convertMiliUnitstoAmount } from "@/lib/utils";
import { Expense, Frequency, Income } from "@/types/app-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ExpenseState = {
  expenses: ({ id: number } & Income)[];
  getExpense: (id?: number) => ExpenseFormValues | undefined;
  addExpense: (expense: Expense) => Expense & { id: number };
  editExpense: (id: number, expense: Expense) => void;
  removeExpense: (id: number) => void;
  removeExpenses: (ids: number[]) => void;
};

export const useExpense = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      getExpense: (id) => {
        const expense = get().expenses.find((expense) => expense.id === id);
        return expense
          ? {
              name: expense.name,
              frequency: expense.frequency,
              vaultId: expense.vault.id,
              amount: convertMiliUnitstoAmount(expense.amount).toString(),
              ...(expense.frequencyOfChange === Frequency.NEVER
                ? {
                    frequencyOfChange: Frequency.NEVER,
                  }
                : {
                    frequencyOfChange: expense.frequencyOfChange,
                    amountOfChange: expense.isPercentageChange
                      ? expense.amountOfChange.toString()
                      : convertMiliUnitstoAmount(
                          expense.amountOfChange
                        ).toString(),
                  }),
            }
          : undefined;
      },
      addExpense: (expense) => {
        const data = { ...expense, id: get().expenses.length + 1 };
        set((state) => ({
          expenses: [...state.expenses, data],
        }));
        return data;
      },
      editExpense: (id, expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses.map((i) =>
              i.id === id ? { id: id, ...expense } : i
            ),
          ],
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
      removeExpenses: (ids) =>
        set((state) => ({
          expenses: state.expenses.filter(
            (expense) => !ids.includes(expense.id)
          ),
        })),
    }),
    {
      name: "expense-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
