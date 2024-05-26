import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAddIncome } from "@/features/income/hooks/use-add-income";
import IncomeForm from "./income-form";
import { useIncome } from "@/features/income/hooks/use-income";
import { Frequency, Income } from "@/types/app-types";
import { useVault } from "@/features/vault/hooks/use-vault";

export default function AddIncomeSheet() {

    const {isOpen, onClose} = useAddIncome()
    const {addIncome} = useIncome()
    const {addIncomeToVault} = useVault()

    const handleSubmit = (values: Income) => {
      const income = addIncome(values)
      addIncomeToVault(values.vault.id, income)
      onClose()
    }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}> 
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add Income</SheetTitle>
          <SheetDescription>
            Add income to track your earnings accurately.
          </SheetDescription>
        </SheetHeader>
        <IncomeForm onSubmit={handleSubmit} defaultValues={{
          amount: "",
          frequencyOfChange: Frequency.NEVER,
          name: "",
          frequency: Frequency.ONE_TIME,
          vaultId: 1,
        }} />
      </SheetContent>
    </Sheet>
  );
}
