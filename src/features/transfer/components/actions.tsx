"use client";

import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOpenTransfer } from "../hooks/use-open-transfer";
import { useTransfer } from "../hooks/use-transfer";
import { useVault } from "@/features/vault/hooks/use-vault";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  id: number;
};

export default function Actions({ id }: Props) {
  const { onOpen } = useOpenTransfer();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transfer."
  );

  const { removeTransfer } = useTransfer();


  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      removeTransfer(id);
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
