"use client";

import AddExpenseSheet from "@/features/expense/components/add-expense-sheet";
import EditExpenseSheet from "@/features/expense/components/edit-expense-sheet";
import AddIncomeSheet from "@/features/income/components/add-income-sheet";
import EditIncomeSheet from "@/features/income/components/edit-income-sheet";
import AddTransferSheet from "@/features/transfer/components/add-transfer-sheet";
import EditTransferSheet from "@/features/transfer/components/edit-transfer-sheet";
import CreateVaultSheet from "@/features/vault/components/create-vault-sheet";
import EditVaultSheet from "@/features/vault/components/edit-vault-sheet";
import { useEffect, useState } from "react";

export default function SheetProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AddIncomeSheet />
      <EditIncomeSheet />
      <AddExpenseSheet />
      <EditExpenseSheet />
      <CreateVaultSheet />
      <EditVaultSheet />
      <AddTransferSheet />
      <EditTransferSheet />
    </>
  );
}
