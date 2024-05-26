import { Frequency } from "@/types/app-types";

export const frequencies: { text: string; value: Frequency }[] = [
  {
    text: "One-Time",
    value: Frequency.ONE_TIME,
  },
  {
    text: "Daily",
    value: Frequency.DAILY,
  },
  {
    text: "Weekly",
    value: Frequency.WEEKLY,
  },
  {
    text: "Biweekly",
    value: Frequency.BIWEEKLY,
  },
  {
    text: "Monthly",
    value: Frequency.MONTHLY,
  },
  {
    text: "Quarterly",
    value: Frequency.QUARTERLY,
  },
  {
    text: "Semi-Annually",
    value: Frequency.SEMI_ANNUALLY,
  },
  {
    text: "Annually",
    value: Frequency.ANNUALLY,
  },
  {
    text: "Biennially",
    value: Frequency.BIENNIALLY,
  },
  {
    text: "Triannually",
    value: Frequency.TRIANNUALLY,
  },
];
