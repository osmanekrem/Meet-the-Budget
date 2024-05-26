"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { convertMiliUnitstoAmount, formatCurrency } from "@/lib/utils";
import { Income } from "@/types/app-types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Actions from "./actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<{id:number}&Income>[] = [
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
    accessorKey: "frequency",
    header: "Frequency",
    cell: ({ row }) => {
      const value: string = row.getValue("frequency");
      return <span className="capitalize">{value}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return formatCurrency(convertMiliUnitstoAmount(amount));
    },
  },
  {
    accessorKey: "vault",
    header: "Vault",
    cell: ({row}) => row.original.vault.name
  },
  {
    accessorKey: "frequencyOfChange",
    header: "Frequency of Change",
    cell: ({ row }) => {
      const value: string = row.getValue("frequencyOfChange");
      return <span className="capitalize">{value}</span>;
    },
  },
  {
    accessorKey: "amountOfChange",
    header: "Amount of Change",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountOfChange"));

      const isPercentageChange = row.original.isPercentageChange

      const finalValue = !amount ? "-" : isPercentageChange ? `%${amount}` : formatCurrency(convertMiliUnitstoAmount(amount)) 

      return finalValue;
    },
  },
  {
    id: "actions",
    cell: ({row}) => <Actions id={row.original.id} />
  }
];
