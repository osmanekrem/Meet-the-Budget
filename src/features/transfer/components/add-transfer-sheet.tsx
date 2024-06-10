import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TransferForm from "./transfer-form";
import { CreateTransfer, Frequency, Income } from "@/types/app-types";
import { useVault } from "@/features/vault/hooks/use-vault";
import { useTransfer } from "../hooks/use-transfer";
import { useAddTransfer } from "../hooks/use-add-transfer";

export default function AddTransferSheet() {
  const { isOpen, onClose } = useAddTransfer();
  const { addTransfer } = useTransfer();
  const { vaults } = useVault();

  const handleSubmit = (values: CreateTransfer) => {
    const transfer = addTransfer(values);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add Transfer</SheetTitle>
          <SheetDescription>
            Specify the amount and select the vaults to transfer funds between.
            Simplify your savings management with easy transfers.
          </SheetDescription>
        </SheetHeader>
        <TransferForm
          onSubmit={handleSubmit}
          defaultValues={{
            amount: "",
            frequencyOfChange: Frequency.NEVER,
            name: "",
            frequency: Frequency.ONE_TIME,
            fromVaultId: vaults[0].id,
            toVaultId: 0,
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
