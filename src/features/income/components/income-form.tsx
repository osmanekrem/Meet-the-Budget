"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { TrashIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { frequencies } from "@/constants/frequencies";
import CurrencyInput from "@/components/currency-input";
import { Frequency, Income } from "@/types/app-types";
import { cn, convertAmountToMiliUnits } from "@/lib/utils";
import { useVault } from "@/features/vault/hooks/use-vault";
import ChangeInput from "@/components/change-input";
import { useState } from "react";
import { durationTypes } from "@/constants/durations";
import DatePicker from "@/components/ui/date-picker";

export const IncomeFormSchema = z
  .object({
    name: z.string().min(2),
    frequency: z.nativeEnum(Frequency),
    amount: z.string(),
    vaultId: z.number(),
    frequencyOfChange: z.nativeEnum(Frequency),
    amountOfChange: z.string().optional(),
    isPercentageChange: z.boolean().optional(),
    startDate: z.date().optional(),
    finishDate: z.date().optional(),
    firstChangeDate: z.date().optional(),
  })
  .refine((data) => {
    if (
      data.frequencyOfChange !== Frequency.NEVER &&
      !data.amountOfChange &&
      data.isPercentageChange === undefined
    )
      return false;

    if (
      !data.frequencyOfChange ||
      !data.amount ||
      !data.name ||
      data.name.length < 2
    )
      return false;

    return true;
  });

export type IncomeFormValues = z.infer<typeof IncomeFormSchema>;

type Props = {
  id?: number;
  defaultValues?: IncomeFormValues;
  onSubmit: (values: Income) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function IncomeForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(IncomeFormSchema),
    defaultValues: defaultValues,
  });

  const { getVault, vaults } = useVault();

  const handleSubmit = (values: IncomeFormValues) => {
    const controlledAmountOfChange =
      values.frequencyOfChange !== Frequency.NEVER
        ? !!values.isPercentageChange
          ? parseFloat(values.amountOfChange as string)
          : convertAmountToMiliUnits(
              parseFloat(values.amountOfChange as string)
            )
        : undefined;
    const controlledAmount = convertAmountToMiliUnits(
      parseFloat(values.amount)
    );

    const data: Income = {
      name: values.name,
      frequency: values.frequency,
      vault: getVault(values.vaultId) ?? vaults[0],
      startDate: values.startDate,
      finishDate: values.finishDate,
      amount: controlledAmount,
      ...(values.frequencyOfChange === Frequency.NEVER
        ? {
            frequencyOfChange: Frequency.NEVER,
          }
        : {
            frequencyOfChange: values.frequencyOfChange,
            firstChangeDate: values.firstChangeDate,
            amountOfChange: controlledAmountOfChange as number,
            isPercentageChange: values.isPercentageChange as boolean,
          }),
    };

    onSubmit(data);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full relative"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Name" {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency of Income</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((frequency) => (
                    <SelectItem key={frequency.value} value={frequency.value}>
                      {frequency.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount of Income</FormLabel>
              <CurrencyInput
                disabled={disabled}
                placeholder="0.00"
                onChange={field.onChange}
                value={field.value}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vaultId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vault</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(+value)}
                defaultValue={field.value.toString() ?? "1"}
                value={field.value.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vault" />
                </SelectTrigger>
                <SelectContent>
                  {vaults.map((vault) => (
                    <SelectItem key={vault.id} value={vault.id.toString()}>
                      {vault.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="finishDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Finish Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frequencyOfChange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency of Change</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || Frequency.NEVER}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    {
                      text: "Never",
                      value: Frequency.NEVER,
                    },
                    ...frequencies.filter(
                      (f) => f.value !== Frequency.ONE_TIME
                    ),
                  ].map((frequency) => (
                    <SelectItem key={frequency.value} value={frequency.value}>
                      {frequency.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {form.getValues().frequencyOfChange !== Frequency.NEVER && (
          <FormField
            control={form.control}
            name="firstChangeDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>First Change Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {form.getValues().frequencyOfChange !== Frequency.NEVER && (
          <FormField
            control={form.control}
            name="amountOfChange"
            disabled={form.getValues().frequencyOfChange === Frequency.NEVER}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount of Change</FormLabel>
                <ChangeInput
                  isPercentageChange={form.watch("isPercentageChange") ?? false}
                  setIsPerecentageChange={(value: any) =>
                    form.setValue("isPercentageChange", value)
                  }
                  disabled={disabled || field.disabled}
                  placeholder="0.00"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
        )}
        <Button
          className="w-full"
          disabled={
            !form.formState.isValid ||
            form.formState.isLoading ||
            form.formState.isSubmitting ||
            disabled
          }
        >
          {id ? "Save Changes" : "Add Income"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <TrashIcon className="size-4 mr-2" />
            Delete
          </Button>
        )}
      </form>
    </Form>
  );
}
