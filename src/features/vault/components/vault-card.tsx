"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useCreateVault } from "@/features/vault/hooks/use-create-vault";
import { useVault } from "@/features/vault/hooks/use-vault";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useTransfer } from "@/features/transfer/hooks/use-transfer";

export default function VaultCard() {
  const { onOpen } = useCreateVault();
  const { vaults, removeVaults } = useVault();
  const {removeTransfers, transfers} = useTransfer()

  return (
    <Card className="text-start overflow-hidden">
      <CardHeader>
        <div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center">
          <CardTitle className="text-xl line-clamp-1">Your Vaults</CardTitle>
          <Button onClick={onOpen} className="w-full lg:w-auto" size={"sm"}>
            <PlusIcon className="size-5 mr-2" />
            Add new
          </Button>
        </div>
        <CardDescription>
          View and manage your savings across different vaults. Stay organized
          and track your progress towards each financial goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={vaults}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            const transferIdsToRemove = transfers.filter(t => ids.includes(t.from.id) || ids.includes(t.to.id)).map(t => t.id)
            removeTransfers(transferIdsToRemove)
            removeVaults(ids);
          }}
        />
      </CardContent>
    </Card>
  );
}
