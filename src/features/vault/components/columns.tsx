"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, convertMiliUnitstoAmount, formatCurrency } from "@/lib/utils";
import { Vault } from "@/types/app-types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Actions from "./actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Vault>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "initialMoney",
    header: "Initial Money",
    cell: ({row}) => {
      const initialMoney = convertMiliUnitstoAmount(row.original.initialMoney)
      return formatCurrency(initialMoney)
    }
  },
  {
    accessorKey: "isExpendable",
    header: "is Expendable?",
    cell: ({ row }) => {
      const value = row.original.isExpendable ? "Expendable" : "No Expendable";
      return <div className={cn(" h-8 font-medium whitespace-nowrap text-sm px-2.5 rounded-full w-min flex items-center justify-center", row.original.isExpendable ? "bg-primary/40 text-primary-foreground" : "bg-rose-400/40 text-primary-foreground")}>{value}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
