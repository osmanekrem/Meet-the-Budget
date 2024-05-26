"use client";

import { EditIcon, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOpenExpense } from "../hooks/use-open-expense";
import { useConfirm } from "@/hooks/use-confirm";
import { useVault } from "@/features/vault/hooks/use-vault";
import { useExpense } from "../hooks/use-expense";

type Props = {
  id: number;
};

export default function Actions({ id }: Props) {
  const { onOpen } = useOpenExpense();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this expense."
  );

  const { removeExpenseFromVault } = useVault();
  const { getExpense, removeExpense } = useExpense();

  const expense = getExpense(id);
  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      removeExpense(id);
      if (expense?.vaultId) removeExpenseFromVault(expense.vaultId, id);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={false} onClick={() => onOpen(id)}>
            <EditIcon className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
