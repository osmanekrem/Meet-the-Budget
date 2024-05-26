import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import React from "react";

type Props = {
    change: number,
    isPercentage?: boolean
};

export default function StatusBadge({change, isPercentage=true}: Props) {
  return (
    <span
      className={cn(
        "py-0.5 font-medium whitespace-nowrap text-xs px-1.5 rounded-md w-min flex items-center justify-center",
        change > 0
          ? "bg-primary/40 text-primary-foreground"
          : "bg-rose-400/40 text-primary-foreground"
      )}
    >
      {isPercentage ? formatPercentage(change) : formatCurrency(change)}
    </span>
  );
}
