import { convertMiliUnitstoAmount, getDaysOfFrequency } from "@/lib/utils";
import { Expense, Frequency, Income, Vault } from "@/types/app-types";

type Data = {
  amount: number;
  increase: number;
  afterDays: number;
};

export type SummaryData = {
  incomeList: { name: string; totalAmount: number; isPercentage: boolean | undefined; data: Data[] }[];
  totalIncome: number;
  remaining: number;
  expenseList: { name: string; totalAmount: number; isPercentage: boolean | undefined; data: Data[] }[];
  totalExpense: number;
  initialRemaining: number;
};

export function getSummaryByDate(vaults: Vault[], daysCount: number) {

  let data: SummaryData = {
    incomeList: [],
    totalIncome: 0,
    initialRemaining: 0,
    remaining: 0,
    expenseList: [],
    totalExpense: 0,
  };

  vaults.forEach((vault) => {
    data.incomeList.push(...getDataList(vault.incomes, daysCount));
    data.expenseList.push(...getDataList(vault.expenses, daysCount));
    data.initialRemaining += vault.initialMoney;
  });

  data.totalIncome = data.incomeList
    .map((i) => i.data.map((i) => i.amount).reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
  data.totalExpense = data.expenseList
    .map((i) => i.data.map((i) => i.amount).reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
  data.remaining += convertMiliUnitstoAmount(data.initialRemaining) + data.totalIncome - data.totalExpense;
  return data;
}

const getDataList = (datas: Income[] | Expense[], daysCount: number) => {
  return datas.map((data) => {
    const frequencyDays = getDaysOfFrequency(data.frequency);
    const changeFrequencyDays = getDaysOfFrequency(data.frequencyOfChange);
    const startAmount = convertMiliUnitstoAmount(data.amount);

    let values: Data[] = [];
    for (let i = frequencyDays; i <= daysCount; i += frequencyDays) {
      const changeCount = Math.floor(
        (i-frequencyDays) / changeFrequencyDays
      );

      

      let finalAmount = startAmount;
      if (data.frequencyOfChange !== Frequency.NEVER) {
        for (let c = 0; c < changeCount; c++) {
          if (data.isPercentageChange) {
            finalAmount *= (100 + data.amountOfChange) / 100;
          } else {
            finalAmount += convertMiliUnitstoAmount(data.amountOfChange);
          }
        }
      }
      let increase = data.isPercentageChange ? (finalAmount/startAmount)*100-100 : finalAmount - startAmount;

      values.push({
        amount: finalAmount,
        increase,
        afterDays: i/frequencyDays,
      });
    }
    const totalAmount = values.reduce((total, value) => total + value.amount, 0);

    return {
      name: data.name,
      totalAmount,
      data: values,
      isPercentage: data.isPercentageChange
    }
  });
};
