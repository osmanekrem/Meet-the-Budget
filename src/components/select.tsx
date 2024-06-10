"use client";

import React, { useMemo } from "react";
import CreateableSelect from "react-select/creatable";
import { SingleValue } from "react-select";

type Props = {
  onChange: (value?: string) => void;
  onCreate: (value: string) => void;
  options: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export default function Select({
  onChange,
  onCreate,
  options,
  disabled,
  value,
  placeholder,
}: Props) {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreateableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "e2e8f0",
          ":hover": {
            borderColor: "e2e8f0",
          },
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
}
