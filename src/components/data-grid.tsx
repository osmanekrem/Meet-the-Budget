"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataCard from "./data-card";
import {
  SummaryData,
  getSummaryByDate,
} from "@/features/summary/api/get-summary";
import { formatCurrency } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useVault } from "@/features/vault/hooks/use-vault";
import StatusBadge from "./status-badge";
import { useSearchParams } from "next/navigation";
import Filters from "./filters";
import Link from "next/link";
import { useTransfer } from "@/features/transfer/hooks/use-transfer";

export default function DataGrid() {
  const { getVaults } = useVault();
  const {transfers: transfersData} = useTransfer()

  const params = useSearchParams();

  const durationType = useMemo(
    () => parseInt(params.get("durationType") || "1", 10),
    [params]
  );
  const durationCount = useMemo(
    () => parseInt(params.get("durationCount") || "0", 10),
    [params]
  );
  const vaultId = useMemo(() => params.get("vaultId") || "all", [params]);

  const vaultIdProcessed = useMemo(
    () => (vaultId && vaultId !== "all" ? [parseInt(vaultId, 10)] : "all"),
    [vaultId]
  );

  const transfers = useMemo(() => vaultId === "all" ? [] : transfersData,[vaultId, transfersData])

  const [incomesShow, setIncomesShow] = useState(false);
  const [expensesShow, setExpensesShow] = useState(false);

  const [summary, setSummary] = useState<SummaryData | undefined>();

  const vaults = useMemo(() => {
    return getVaults(vaultIdProcessed);
  }, [vaultIdProcessed, getVaults]);

  useEffect(() => {
    const fetchSummary = () => {
      const result = getSummaryByDate(vaults, durationType * durationCount, transfers);
      setSummary(result);
    };
    fetchSummary();
  }, [vaults, durationType, durationCount, transfers]);

  if (!summary) return null;

  return (
    <div className="flex flex-col gap-y-4">
      <Filters />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCard title="Remaining">
          <p className="text-3xl font-bold">
            {formatCurrency(summary.remaining)}
          </p>
        </DataCard>
        <DataCard title="Incomes">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-x-2 items-end justify-between border-b pb-4">
              <span className="text-sm lg:text-base text-muted-foreground">Total Incomes</span>
              <span className="font-bold text-2xl lg:text-3xl truncate">
                {formatCurrency(summary.totalIncome)}
              </span>
            </div>
            {incomesShow && (summary.incomeList.length ? (
              <Accordion type="multiple" className="w-full">
                {summary.incomeList.map((income, i) => (
                  <AccordionItem key={i} value={i.toString()}>
                    <AccordionTrigger>
                      <div className="flex flex-1 pr-2.5 justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {income.name}
                        </span>
                        <span className="font-bold text-lg lg:text-xl">
                          {formatCurrency(income.totalAmount)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-0.5">
                        {income.data.map((d, i) => (
                          <p
                            key={i}
                            className="flex justify-between items-center gap-x-1.5"
                          >
                            <span> {d.afterDays}</span>
                            <span className="font-medium text-lg flex items-center gap-x-1.5">
                              {formatCurrency(d.amount)}{" "}
                              {d.increase !== 0 && (
                                <StatusBadge
                                  change={d.increase}
                                  isPercentage={!!income.isPercentage}
                                />
                              )}
                            </span>
                          </p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex items-center justify-center p-2 py-8 border-b">
                <p className="flex flex-col gap-1.5 items-center">
                You don&apos;t have any income yet. 
                <Link href="/save/incomes" className={buttonVariants({size: "sm"})} >Add income</Link>
                </p>
                
              </div>
            ))}
            <Button
              variant={"ghost"}
              className="text-primary-foreground"
              size={"sm"}
              onClick={() => setIncomesShow((prev) => !prev)}
            >
              {incomesShow ? "Hide Incomes" : "Show Incomes"}
            </Button>
          </div>
        </DataCard>
        <DataCard title="Expenses">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-x-2 items-end justify-between border-b pb-4">
              <span className="text-sm lg:text-base text-muted-foreground">Total Expenses</span>
              <span className="font-bold text-2xl lg:text-3xl truncate">
                {formatCurrency(summary.totalExpense)}
              </span>
            </div>
            {expensesShow && (
              summary.expenseList.length ? (
              <Accordion type="multiple" className="w-full">
                {summary.expenseList.map((expense, i) => (
                  <AccordionItem key={i} value={i.toString()}>
                    <AccordionTrigger>
                      <div className="flex flex-1 pr-2.5 justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {expense.name}
                        </span>
                        <span className="font-bold text-lg lg:text-xl">
                          {formatCurrency(expense.totalAmount)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-0.5">
                        {expense.data.map((d, i) => (
                          <p
                            key={i}
                            className="flex justify-between items-center gap-x-1.5"
                          >
                            <span> {d.afterDays}</span>
                            <span className="font-medium text-lg flex items-center gap-x-1.5">
                              {formatCurrency(d.amount)}{" "}
                              {d.increase !== 0 && (
                                <StatusBadge
                                  change={d.increase}
                                  isPercentage={!!expense.isPercentage}
                                />
                              )}
                            </span>
                          </p>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              )  : (
                <div className="flex items-center justify-center p-2 py-8 border-b">
                  <p className="flex flex-col gap-1.5 items-center">
                  You don&apos;t have any expense yet. 
                  <Link href="/save/expenses" className={buttonVariants({size: "sm"})} >Add expense</Link>
                  </p>
                  
                </div>
              )
            )}
            <Button
              variant={"ghost"}
              className="text-primary-foreground"
              size={"sm"}
              onClick={() => setExpensesShow((prev) => !prev)}
            >
              {expensesShow ? "Hide expenses" : "Show expenses"}
            </Button>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
