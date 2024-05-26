"use client";

import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useOpenIncome } from "@/features/income/hooks/use-open-income";
import { useIncome } from "../hooks/use-income";
import { useVault } from "@/features/vault/hooks/use-vault";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  id: number;
};

export default function Actions({ id }: Props) {
  const { onOpen } = useOpenIncome();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this income."
  );

  const { removeIncomeFromVault } = useVault();
  const { getIncome, removeIncome } = useIncome();

  const income = getIncome(id);

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      removeIncome(id);
      if (income?.vaultId) removeIncomeFromVault(income.vaultId, id);
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
          <DropdownMenuItem disabled={false} onClick={() => handleDelete()}>
            <TrashIcon className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
