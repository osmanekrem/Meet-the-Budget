import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TransferForm, { TransferFormValues } from "./transfer-form";
import { CreateTransfer, Frequency } from "@/types/app-types";
import { useConfirm } from "@/hooks/use-confirm";
import { useTransfer } from "../hooks/use-transfer";
import { useVault } from "@/features/vault/hooks/use-vault";
import { useOpenTransfer } from "../hooks/use-open-transfer";

export default function EditTransferSheet() {
  const { id, isOpen, onClose } = useOpenTransfer();

  const { getTransfer, editTransfer, removeTransfer } = useTransfer();
  const {getExpendableVaults} = useVault()

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transfer."
  );

  if (!id) return null;

  const transfer = getTransfer(id);
  const expendableVaults = getExpendableVaults()

  // if(vaults.length < 2 || expendableVaults.length < 1) return null

  const defaultValues: TransferFormValues = !!transfer
    ? transfer
    : {
        amount: "",
        frequencyOfChange: Frequency.NEVER,
        name: "",
        fromVaultId: expendableVaults[0].id,
        toVaultId: 0,
        frequency: Frequency.ONE_TIME,
      };

  const handleSubmit = (values: CreateTransfer) => {
    editTransfer(id, values);
    onClose();
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      removeTransfer(id);
      onClose();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transfer</SheetTitle>
            <SheetDescription>Edit an existing transfer.</SheetDescription>
          </SheetHeader>
          <TransferForm
            id={id}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            defaultValues={defaultValues}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
