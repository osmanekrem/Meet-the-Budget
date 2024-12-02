"use client";

import React, { useCallback, useEffect, useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import qs from "query-string";
import { useVault } from '@/features/vault/hooks/use-vault';
import { durationTypes } from '@/constants/durations';
import DatePicker from './ui/date-picker';

type Props = {}


const useDebouncedValue = (inputValue: any, delay: number = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(inputValue);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [inputValue, delay]);
  
    return debouncedValue;
  };

export default function Filters({}: Props) {

    const params = useSearchParams();
    const pathname = usePathname()
    const router = useRouter()

    const {vaults} = useVault()
    const ed = params.get("endDate")
    const [endDate, setEndDate] = useState(ed ? new Date(ed) : undefined)
    const [vaultId, setVaultId] = useState(params.get("vaultId") || "all")


    const pushToUrl = useCallback((endDate: Date | undefined, vaultId: string) => {
        const query = {
            endDate: endDate?.toString(),
            vaultId: vaultId
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query
        }, {skipEmptyString: true, skipNull: true})

        router.push(url)
    }, [pathname, router])

    useEffect(() => {
        pushToUrl(endDate, vaultId)
    }, [endDate, vaultId, pushToUrl])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <DatePicker onChange={e => setEndDate(e)} value={endDate} />
        <Select
                onValueChange={e => setVaultId(e)}
                defaultValue={"all"}
                value={vaultId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vault" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>
                        All
                    </SelectItem>
                  {vaults.map((vault) => (
                    <SelectItem key={vault.id} value={vault.id.toString()}>
                      {vault.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
        </div>
  )
}