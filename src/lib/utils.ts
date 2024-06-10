import { Frequency } from "@/types/app-types";
import { type ClassValue, clsx } from "clsx";
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
