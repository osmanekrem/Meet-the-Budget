"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useExpense } from "../hooks/use-expense";
import { useAddExpense } from "../hooks/use-add-expense";
import { useVault } from "@/features/vault/hooks/use-vault";

export default function ExpenseCard() {

    const {expenses, removeExpenses} = useExpense()
    const {removeExpenseFromVault} = useVault()
    const {onOpen} = useAddExpense()

  return (
    <Card className="text-start overflow-hidden">
      <CardHeader>
        <div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center">

        <CardTitle className="text-xl line-clamp-1">Your Expenses</CardTitle>
        <Button onClick={onOpen} className="w-full lg:w-auto" size={"sm"}>
          <PlusIcon className="size-5 mr-2" />
          Add new 
        </Button>
        </div>
        <CardDescription>
        Track and categorize your expenses to stay on top of your budget. Understand your spending habits and make informed financial decisions.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <DataTable columns={columns} data={expenses} onDelete={(row) => {
            const ids = row.map((r) => r.original.id)
            removeExpenses(ids)
            row.map(r => r.original).forEach(r => removeExpenseFromVault(r.vault.id, r.id))
          }} />
      </CardContent>
    </Card>
  );
}
