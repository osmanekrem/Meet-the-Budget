import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Expense, Frequency, Income } from "@/types/app-types";
import { useVault } from "@/features/vault/hooks/use-vault";
import { useAddExpense } from "../hooks/use-add-expense";
import { useExpense } from "../hooks/use-expense";
import ExpenseForm from "./expense-form";

export default function AddExpenseSheet() {

    const {isOpen, onClose} = useAddExpense()
    const {addExpense} = useExpense()
    const {addExpenseToVault, getExpendableVaults} = useVault()

    const expendableVaults = getExpendableVaults()

    const handleSubmit = (values: Expense) => {
      const expense = addExpense(values)
      addExpenseToVault(values.vault.id, expense)
      onClose()
    }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}> 
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add Expense</SheetTitle>
          <SheetDescription>
          Enter your expense details to keep your budget up-to-date. Track every spending to manage your finances better.
          </SheetDescription>
        </SheetHeader>
        <ExpenseForm onSubmit={handleSubmit} defaultValues={{
          amount: "",
          frequencyOfChange: Frequency.NEVER,
          name: "",
          frequency: Frequency.ONE_TIME,
          vaultId: expendableVaults[0].id
        }} />
      </SheetContent>
    </Sheet>
  );
}
