import { Frequency } from "@/types/app-types";
import { type ClassValue, clsx } from "clsx";
import { addDays, addMonths, addQuarters, addWeeks, addYears, differenceInDays, differenceInMonths, differenceInQuarters, differenceInWeeks, differenceInYears } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMiliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function convertMiliUnitstoAmount(miliunits: number) {
  return miliunits / 1000;
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value); 
}

export function formatPercentage(value:number) {
  const result = new Intl.NumberFormat("de-DE", {
    style: "percent",
  }).format(value/100)

  return result
}


export function getDaysOfFrequency(frequency: Frequency) {
  switch (frequency) {
    case Frequency.ONE_TIME: return -1
    case Frequency.DAILY: return 1
    case Frequency.WEEKLY: return 7
    case Frequency.BIWEEKLY: return 14
    case Frequency.MONTHLY: return 30
    case Frequency.QUARTERLY: return 90
    case Frequency.SEMI_ANNUALLY: return 180
    case Frequency.ANNUALLY: return 365
    case Frequency.BIENNIALLY: return 730
    case Frequency.TRIANNUALLY: return 1095
    default: return 0
  }
}

export const addByFrequency = (date: Date, frequency: Frequency): Date => {
  switch (frequency) {
    case Frequency.DAILY: return addDays(date, 1);
    case Frequency.WEEKLY: return addWeeks(date, 1);
    case Frequency.BIWEEKLY: return addWeeks(date, 2);
    case Frequency.MONTHLY: return addMonths(date, 1);
    case Frequency.QUARTERLY: return addQuarters(date, 1);
    case Frequency.SEMI_ANNUALLY: return addMonths(date, 6);
    case Frequency.ANNUALLY: return addYears(date, 1);
    case Frequency.BIENNIALLY: return addYears(date, 2);
    case Frequency.TRIANNUALLY: return addYears(date, 3);
    default: return date;
  }
};

export const differenceByFrequency = (laterDate: Date, earlierDate: Date, frequency: Frequency): number => {
  switch (frequency) {
    case Frequency.DAILY: return differenceInDays(laterDate, earlierDate);
    case Frequency.WEEKLY: return differenceInWeeks(laterDate, earlierDate);
    case Frequency.BIWEEKLY: return Math.floor(differenceInWeeks(laterDate, earlierDate) / 2);
    case Frequency.MONTHLY: return differenceInMonths(laterDate, earlierDate);
    case Frequency.QUARTERLY: return differenceInQuarters(laterDate, earlierDate);
    case Frequency.SEMI_ANNUALLY: return Math.floor(differenceInMonths(laterDate, earlierDate) / 6);
    case Frequency.ANNUALLY: return differenceInYears(laterDate, earlierDate);
    case Frequency.BIENNIALLY: return Math.floor(differenceInYears(laterDate, earlierDate) / 2);
    case Frequency.TRIANNUALLY: return Math.floor(differenceInYears(laterDate, earlierDate) / 3);
    default: return 0;
  }
};
