import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import IncomeForm, { IncomeFormValues } from "./income-form";
import { useIncome } from "@/features/income/hooks/use-income";
import { Frequency, Income } from "@/types/app-types";
import { useOpenIncome } from "@/features/income/hooks/use-open-income";
import { useConfirm } from "@/hooks/use-confirm";
import { useVault } from "@/features/vault/hooks/use-vault";

export default function EditIncomeSheet() {
  const { id, isOpen, onClose } = useOpenIncome();

  const { removeIncomeFromVault, editIncomeInVault } = useVault();
  const { getIncome, getIncomeWithValues, editIncome, removeIncome } = useIncome();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this income."
  );

  if (!id) return null;

  const income = getIncome(id);
  const incomeWithValues = getIncomeWithValues(id);

  const defaultValues: IncomeFormValues = !!income
    ? income
    : {
        amount: "",
        frequencyOfChange: Frequency.NEVER,
        name: "",
        vaultId: 1,
        frequency: Frequency.ONE_TIME,
      };

  const handleSubmit = (values: Income) => {
    editIncome(id, values);
    editIncomeInVault(values.vault.id, {id, ...values})
    onClose();
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      removeIncome(id);
      if (income?.vaultId) removeIncomeFromVault(income.vaultId, id);
      onClose();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Income</SheetTitle>
            <SheetDescription>Edit an existing income.</SheetDescription>
          </SheetHeader>
          <IncomeForm
            id={id}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            defaultValues={defaultValues}
            values={!!incomeWithValues?.startDay || !!incomeWithValues?.duration ? {
              startDay: incomeWithValues.startDay,
              duration: incomeWithValues.duration
            } : undefined}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
