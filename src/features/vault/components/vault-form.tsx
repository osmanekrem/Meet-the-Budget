"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "../../../components/ui/button";

import { TrashIcon } from "lucide-react";


import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../components/ui/form";

import { Checkbox } from "../../../components/ui/checkbox";
import CurrencyInput from "@/components/currency-input";
import { CreateVault, Vault } from "@/types/app-types";
import { convertAmountToMiliUnits } from "@/lib/utils";

export const VaultFormSchema = z.object({
  name: z.string().min(2),
  isExpendable: z.boolean(),
  initialMoney: z.string()
});

export type VaultFormValues = z.infer<typeof VaultFormSchema>;

type Props = {
  id?: number;
  defaultValues?: VaultFormValues;
  onSubmit: (values: CreateVault) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function VaultForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
  const form = useForm<VaultFormValues>({
    resolver: zodResolver(VaultFormSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: VaultFormValues) => {
    const controlledInitialMoney = convertAmountToMiliUnits(parseFloat(values.initialMoney))
    console.log(controlledInitialMoney,values.initialMoney,parseFloat(values.initialMoney));
    
    const data: CreateVault = {...values, initialMoney: controlledInitialMoney}
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
          name="initialMoney"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Money</FormLabel>
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
          name="isExpendable"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-2">
              <FormControl>
                <Checkbox
                  checked={!field.value}
                  onCheckedChange={e => field.onChange(!e.valueOf())}
                />
              </FormControl>
              <FormLabel className="!mt-0">
                The money in this vault is savings. I won&apos;t spend
              </FormLabel>
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          disabled={
            !form.formState.isValid ||
            form.formState.isLoading ||
            form.formState.isSubmitting ||
            disabled
          }
        >
          {id ? "Save Changes" : "Create Vault"}
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
