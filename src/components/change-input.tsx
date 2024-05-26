import { DollarSignIcon, PercentIcon } from "lucide-react";
import CurrencyInput from "./currency-input";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  setIsPerecentageChange: (value: any) => void;
  placeholder: string;
  disabled?: boolean;
  isPercentageChange: boolean;
};

export default function ChangeInput({
  value,
  onChange,
  isPercentageChange,
  setIsPerecentageChange,
  placeholder,
  disabled,
}: Props) {
  return (
    <div className="flex gap-x-1.5 items-center">
      <Button
        type="button"
        variant={"outline"}
        className="p-0 size-10"
        onClick={() => setIsPerecentageChange(!isPercentageChange)}
      >
        {isPercentageChange ? (
          <PercentIcon className="size-4" />
        ) : (
          <DollarSignIcon className="size-4" />
        )}
      </Button>
      <CurrencyInput
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
      />
    </div>
  );
}
