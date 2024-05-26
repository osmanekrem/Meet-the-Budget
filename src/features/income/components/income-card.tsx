"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useIncome } from "@/features/income/hooks/use-income";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddIncome } from "@/features/income/hooks/use-add-income";
import { useVault } from "@/features/vault/hooks/use-vault";

export default function IncomeCard() {

    const {incomes, removeIncomes} = useIncome()
    const {removeIncomeFromVault} = useVault()
    const {onOpen} = useAddIncome()

  return (
    <Card className="text-start overflow-hidden">
      <CardHeader>
        <div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center">

        <CardTitle className="text-xl line-clamp-1">Your Incomes</CardTitle>
        <Button onClick={onOpen} className="w-full lg:w-auto" size={"sm"}>
          <PlusIcon className="size-5 mr-2" />
          Add new 
        </Button>
        </div>
        <CardDescription>
        Organize your savings into different vaults for various goals. Whether it&apos;s for emergencies, vacations, or future investments, track your progress and watch your savings grow.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <DataTable columns={columns} data={incomes} onDelete={(row) => {
            const ids = row.map((r) => r.original.id)
            removeIncomes(ids)
            row.map(r => r.original).forEach(r => removeIncomeFromVault(r.vault.id, r.id))
          }} />
      </CardContent>
    </Card>
  );
}
