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
import { useTransfer } from "../hooks/use-transfer";
import { useAddTransfer } from "../hooks/use-add-transfer";
export default function TransferCard() {

    const {transfers, removeTransfers} = useTransfer()
    const {onOpen} = useAddTransfer()

    const handleAddTransfer = () => {
      // if(getExpendableVaults().length < 1 || vaults.length < 2) {
      //   toast.error("To add a transfer, you must have two vaults, at least one of which should be expendable.")
      //   return false
      // }
      onOpen()
    }

  return (
    <Card className="text-start overflow-hidden">
      <CardHeader>
        <div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center">

        <CardTitle className="text-xl line-clamp-1">Your Transfers</CardTitle>
        <Button onClick={handleAddTransfer} className="w-full lg:w-auto" size={"sm"}>
          <PlusIcon className="size-5 mr-2" />
          Add new 
        </Button>
        </div>
        <CardDescription>
        Seamlessly transfer funds between your vaults to balance your savings goals. Manage your money more flexibly and stay on track.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <DataTable columns={columns} data={transfers} onDelete={(row) => {
            const ids = row.map((r) => r.original.id)
            removeTransfers(ids)
          }} />
      </CardContent>
    </Card>
  );
}
