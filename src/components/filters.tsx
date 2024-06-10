"use client";

import React, { useCallback, useEffect, useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import qs from "query-string";
import { useVault } from '@/features/vault/hooks/use-vault';
import { durationTypes } from '@/constants/durations';

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

    const [durationType, setDurationType] = useState(params.get("durationType") || "1")
    const [durationCount, setDurationCount] = useState(params.get("durationCount") || "1")
    const [vaultId, setVaultId] = useState(params.get("vaultId") || "all")

    const debouncedDurationCount= useDebouncedValue(durationCount)
    const debouncedDurationType = useDebouncedValue(durationType)

    const pushToUrl = useCallback((durationType:string, durationCount: string, vaultId: string) => {
        const query = {
            durationType,
            durationCount,
            vaultId: vaultId
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query
        }, {skipEmptyString: true, skipNull: true})

        router.push(url)
    }, [pathname, router])

    useEffect(() => {
        pushToUrl(debouncedDurationType, debouncedDurationCount, vaultId)
    }, [debouncedDurationType, debouncedDurationCount, vaultId, pushToUrl])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4">
        <Input value={durationCount} type="number" pattern="[0-9]" min={0} onChange={e => setDurationCount(e.target.value)} />
        <Select
                onValueChange={e => setDurationType(e)}
                defaultValue={"1"}
                value={durationType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationTypes.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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