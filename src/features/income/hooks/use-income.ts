import { IncomeFormValues } from "@/features/income/components/income-form";
import { convertMiliUnitstoAmount } from "@/lib/utils";
import { Frequency, Income } from "@/types/app-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type IncomeState = {
  incomes: ({ id: number } & Income)[];
  getIncome: (id?: number) => IncomeFormValues | undefined;
  addIncome: (income: Income) => Income & { id: number };
  editIncome: (id: number, income: Income) => void;
  removeIncome: (id: number) => void;
  removeIncomes: (ids: number[]) => void;
};

export const useIncome = create<IncomeState>()(
  persist(
    (set, get) => ({
      incomes: [],
      getIncome: (id) => {
        const income = get().incomes.find((income) => income.id === id);
        return income
          ? {
              name: income.name,
              frequency: income.frequency,
              vaultId: income.vault.id,
              amount: convertMiliUnitstoAmount(income.amount).toString(),
              ...(income.frequencyOfChange === Frequency.NEVER
                ? {
                    frequencyOfChange: Frequency.NEVER,
                  }
                : {
                    frequencyOfChange: income.frequencyOfChange,
                    amountOfChange: income.isPercentageChange
                      ? income.amountOfChange.toString()
                      : convertMiliUnitstoAmount(
                          income.amountOfChange
                        ).toString(),
                    isPercentageChange: income.isPercentageChange,
                  }),
            }
          : undefined;
      },
      addIncome: (income) => {
        const data = { ...income, id: get().incomes.length + 1 };
        set((state) => ({
          incomes: [...state.incomes, data],
        }));
        return data;
      },
      editIncome: (id, income) =>
        set((state) => ({
          incomes: [
            ...state.incomes.map((i) =>
              i.id === id ? { id: id, ...income } : i
            ),
          ],
        })),
      removeIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),
      removeIncomes: (ids) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => !ids.includes(income.id)),
        })),
    }),
    {
      name: "income-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
