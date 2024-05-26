"use client";

import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useOpenVault } from "@/features/vault/hooks/use-open-vault";
import { useVault } from "../hooks/use-vault";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  id: number;
};

export default function Actions({ id }: Props) {
  const { onOpen } = useOpenVault();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this vault."
  );

  const { removeVault } = useVault();

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      removeVault(id);
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
