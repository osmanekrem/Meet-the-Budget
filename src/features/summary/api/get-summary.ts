import {
  addByFrequency,
  convertMiliUnitstoAmount,
  differenceByFrequency,
  getDaysOfFrequency,
} from "@/lib/utils";
import { Expense, Frequency, Income, Transfer, Vault } from "@/types/app-types";
import { isAfter, isBefore, startOfDay, isSameDay, addDays } from "date-fns";

export type Data = {
  amount: number;
  increase: number;
  afterDays: number;
  date: Date;
};

export type SummaryData = {
  incomeList: {
    name: string;
    totalAmount: number;
    isPercentage: boolean | undefined;
    data: Data[];
  }[];
  totalIncome: number;
  remaining: number;
  expenseList: {
    name: string;
    totalAmount: number;
    isPercentage: boolean | undefined;
    data: Data[];
  }[];
  totalExpense: number;
  initialRemaining: number;
};

export function getSummaryByDate(
  vaults: Vault[],
  endDate: Date,
  transfers: Transfer[]
) {
  let data: SummaryData = {
    incomeList: [],
    totalIncome: 0,
    initialRemaining: 0,
    remaining: 0,
    expenseList: [],
    totalExpense: 0,
  };

  vaults.forEach((vault) => {
    data.incomeList.push(...getDataList(vault.incomes, endDate));
    data.expenseList.push(...getDataList(vault.expenses, endDate));
    data.initialRemaining += vault.initialMoney;
    if (vaults.length === 1) {
      data.incomeList.push(
        ...getDataList(
          transfers.filter((t) => t.to.id === vault.id),
          endDate
        )
      );
      data.expenseList.push(
        ...getDataList(
          transfers.filter((t) => t.from.id === vault.id),
          endDate
        )
      );
    }
  });

  data.totalIncome = data.incomeList
    .map((i) => i.data.map((i) => i.amount).reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
  data.totalExpense = data.expenseList
    .map((i) => i.data.map((i) => i.amount).reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
  data.remaining +=
    convertMiliUnitstoAmount(data.initialRemaining) +
    data.totalIncome -
    data.totalExpense;
  return data;
}

const getDataList = (
  datas: Income[] | Expense[] | Transfer[],
  endDate: Date
) => {
  const today = startOfDay(new Date());
  return datas.map((data) => {
    const startAmount = convertMiliUnitstoAmount(data.amount);

    const startDate = data.startDate ?? today;
    const firstChangeDate =
      data.firstChangeDate ?? addByFrequency(startDate, data.frequencyOfChange);

    let values: Data[] = [];
    let occurrenceCount = 0;

    for (
      let currentDate = startDate;
      isBefore(currentDate, endDate) || isSameDay(currentDate, endDate);
      currentDate = addByFrequency(currentDate, data.frequency)
    ) {
      if (
        isBefore(currentDate, startDate) ||
        isAfter(currentDate, data.finishDate ?? endDate)
      ) {
        continue;
      }

      let cycleStartDate = startDate;
      let cycleEndDate = addByFrequency(cycleStartDate, data.frequency);

      while (
        isAfter(currentDate, cycleEndDate) ||
        isSameDay(currentDate, cycleEndDate)
      ) {
        cycleStartDate = cycleEndDate;
        cycleEndDate = addByFrequency(cycleStartDate, data.frequency);
      }
      occurrenceCount++;

      const changeCount = differenceByFrequency(
        currentDate,
        startDate,
        data.frequencyOfChange
      );

      const firstChangeApplied =
        isAfter(currentDate, firstChangeDate) ||
        isSameDay(currentDate, firstChangeDate);

      let finalAmount = startAmount;
      if (data.frequencyOfChange !== Frequency.NEVER && firstChangeApplied) {
        const changesSinceFirstChange = differenceByFrequency(
          currentDate,
          firstChangeDate,
          data.frequencyOfChange
        );

        for (let c = 0; c <= changesSinceFirstChange; c++) {
          if (data.isPercentageChange) {
            finalAmount *= (100 + data.amountOfChange) / 100;
          } else {
            finalAmount += convertMiliUnitstoAmount(data.amountOfChange);
          }
        }
      }

      let increase = data.isPercentageChange
        ? (finalAmount / startAmount) * 100 - 100
        : finalAmount - startAmount;

      values.push({
        amount: finalAmount,
        increase,
        afterDays: occurrenceCount,
        date: currentDate,
      });
      if (
        isSameDay(currentDate, cycleEndDate) ||
        (data.frequency === Frequency.ONE_TIME &&
          isAfter(currentDate, startDate))
      ) {
        if (data.frequency === Frequency.ONE_TIME) break;
      }
    }

    // for (let i = Math.max(frequencyDays,0); i <= daysCount; i += (frequencyDays === -1 ? 1 : frequencyDays)) {
    //   const changeCount = Math.floor(
    //     (i-frequencyDays-(startDay.count*startDay.type)) / changeFrequencyDays
    //   );

    //   if((frequencyDays === -1 && (startDay.count*startDay.type) > i)){
    //     continue
    //   }

    //   if(!!startDay){
    //     if(startDay.count*startDay.type >= i) {
    //       continue
    //     }
    //   }
    //   if(!!duration && ((duration.count*duration.type) > 0)){
    //     if((duration.count*duration.type)+(startDay.count*startDay.type) < i) {
    //       continue
    //     }
    //   }

    //   let finalAmount = startAmount;
    //   if (data.frequencyOfChange !== Frequency.NEVER) {
    //     for (let c = 0; c < changeCount; c++) {
    //       if (data.isPercentageChange) {
    //         finalAmount *= (100 + data.amountOfChange) / 100;
    //       } else {
    //         finalAmount += convertMiliUnitstoAmount(data.amountOfChange);
    //       }
    //     }
    //   }
    //   let increase = data.isPercentageChange ? (finalAmount/startAmount)*100-100 : finalAmount - startAmount;

    //   values.push({
    //     amount: finalAmount,
    //     increase,
    //     afterDays: i/Math.max(frequencyDays,1),
    //   });

    //   if((frequencyDays === -1 && (startDay.count*startDay.type) < i)){
    //     break
    //   }
    // }
    const totalAmount = values.reduce(
      (total, value) => total + value.amount,
      0
    );

    return {
      name: data.name,
      totalAmount,
      data: values,
      isPercentage: data.isPercentageChange,
    };
  });
};
