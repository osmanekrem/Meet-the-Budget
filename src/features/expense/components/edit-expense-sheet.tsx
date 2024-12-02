import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { ExpenseFormValues } from "./expense-form";
import { Expense, Frequency } from "@/types/app-types";
import { useConfirm } from "@/hooks/use-confirm";
import { useOpenExpense } from "../hooks/use-open-expense";
import { useExpense } from "../hooks/use-expense";
import ExpenseForm from "./expense-form";
import { useVault } from "@/features/vault/hooks/use-vault";

export default function EditExpenseSheet() {
  const { id, isOpen, onClose } = useOpenExpense();

  const {removeExpenseFromVault,editExpenseInVault} = useVault()
  const { getExpense, editExpense, removeExpense, getExpenseWithValues } = useExpense();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this expense."
  );

  if (!id) return null;

  const expense = getExpense(id);

  const defaultValues: ExpenseFormValues = !!expense
    ? expense
    : {
        amount: "",
        frequencyOfChange: Frequency.NEVER,
        name: "",
        vaultId: 0,
        frequency: Frequency.ONE_TIME,
      };

  const handleSubmit = (values: Expense) => {
    editExpense(id, values);
    editExpenseInVault(values.vault.id, {id,...values})
    onClose();
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      removeExpense(id);  
      if(expense?.vaultId) removeExpenseFromVault(expense.vaultId, id)
      onClose();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Expense</SheetTitle>
            <SheetDescription>Edit an existing expense.</SheetDescription>
          </SheetHeader>
          <ExpenseForm
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
