"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Select } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";

import { TrashIcon } from "lucide-react";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { frequencies } from "@/constants/frequencies";
import CurrencyInput from "@/components/currency-input";
import { Frequency, Income } from "@/types/app-types";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { useVault } from "@/features/vault/hooks/use-vault";
import ChangeInput from "@/components/change-input";
import { useState } from "react";
import { durationTypes } from "@/constants/durations";

export const IncomeFormSchema = z
  .object({
    name: z.string().min(2),
    frequency: z.nativeEnum(Frequency),
    amount: z.string(),
    vaultId: z.number(),
    frequencyOfChange: z.nativeEnum(Frequency),
    amountOfChange: z.string().optional(),
    isPercentageChange: z.boolean().optional()
  })
  .refine((data) => {
    if (data.frequencyOfChange !== Frequency.NEVER && !data.amountOfChange && data.isPercentageChange === undefined)
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
  values?: {
    startDay: {
      count: number
      type: number
    }
    duration: {
      count: number
      type: number
    }
  }
  onSubmit: (values: Income) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function IncomeForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  values,
  disabled,
}: Props) {
  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(IncomeFormSchema),
    defaultValues: defaultValues,
  });

  const {getVault, vaults} = useVault()

  const [startDurationType, setStartDurationType] = useState(values?.startDay.type ?? 1);
  const [startDurationCount, setStartDurationCount] = useState(values?.startDay.count ?? 0);
  const [durationType, setDurationType] = useState(values?.duration.type ?? 1);
  const [durationCount, setDurationCount] = useState(values?.duration.count ?? 0);

  const handleSubmit = (values: IncomeFormValues) => {
    const controlledAmountOfChange =
      values.frequencyOfChange !== Frequency.NEVER
        ? !!values.isPercentageChange ? parseFloat(values.amountOfChange as string) : convertAmountToMiliUnits(parseFloat(values.amountOfChange as string))
        : undefined;
    const controlledAmount = convertAmountToMiliUnits(
      parseFloat(values.amount)
    );

    const data: Income = {
      name: values.name,
      frequency: values.frequency,
      vault: getVault(values.vaultId) ?? vaults[0],
      startDay: {type: startDurationType, count: startDurationCount},
      duration: {type: durationType, count: durationCount},
      amount: controlledAmount,
      ...(values.frequencyOfChange === Frequency.NEVER
        ? {
            frequencyOfChange: Frequency.NEVER,
          }
        : {
            frequencyOfChange: values.frequencyOfChange,
            amountOfChange: controlledAmountOfChange as number,
            isPercentageChange: values.isPercentageChange as boolean
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
        <div className="flex flex-col gap-y-4 items-start">
          <FormLabel>Start After</FormLabel>
          <div className="flex w-full gap-x-4 items-center">
            <Button
            
            className="!w-32 shrink-0"
            variant={"outline"}
              type="button"
              onClick={() => {
                setStartDurationCount(0);
                setStartDurationType(1);
              }}
            >
              Now (0 days)
            </Button>
            <Input
              value={startDurationCount}
              type="number"
              pattern="[0-9]"
              min={0}
              onChange={(e) => setStartDurationCount(+e.target.value)}
            />
            <Select
              onValueChange={(e) => setStartDurationType(+e)}
              value={startDurationType.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {durationTypes.map((duration) => (
                  <SelectItem
                    key={duration.value}
                    value={duration.value.toString()}
                  >
                    {duration.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 items-start">
          <FormLabel>Duration</FormLabel>
          <div className="flex w-full gap-x-4 items-center">
            <Button
            className="!w-32 shrink-0"
            variant={"outline"}
              type="button"
              onClick={() => {
                setDurationCount(0);
                setDurationType(1);
              }}
            >
              Endless (0 days)
            </Button>
            <Input
              value={durationCount}
              type="number"
              pattern="[0-9]"
              min={0}
              onChange={(e) => setDurationCount(+e.target.value)}
            />
            <Select
              onValueChange={(e) => setDurationType(+e)}
              value={durationType.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {durationTypes.map((duration) => (
                  <SelectItem
                    key={duration.value}
                    value={duration.value.toString()}
                  >
                    {duration.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
                    ...frequencies.filter(f => f.value !== Frequency.ONE_TIME),
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
        {form.getValues().frequencyOfChange !== Frequency.NEVER && <FormField
          control={form.control}
          name="amountOfChange"
          disabled={form.getValues().frequencyOfChange === Frequency.NEVER}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount of Change</FormLabel>
              <ChangeInput
                isPercentageChange={form.watch("isPercentageChange") ?? false}
                setIsPerecentageChange={(value: any) => form.setValue("isPercentageChange", value)}
                disabled={disabled || field.disabled}
                placeholder="0.00"
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormItem>
          )}
        />}
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
