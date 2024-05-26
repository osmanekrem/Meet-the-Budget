import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { VaultFormValues } from "./vault-form";
import { useCreateVault } from "@/features/vault/hooks/use-create-vault";
import { useVault } from "@/features/vault/hooks/use-vault";
import VaultForm from "./vault-form";
import { CreateVault, Vault } from "@/types/app-types";

export default function CreateVaultSheet() {

    const {isOpen, onClose} = useCreateVault()
    const {addVault} = useVault()

    const handleSubmit = (values: CreateVault) => {
      addVault(values)
      onClose()
    }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}> 
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Create Vault</SheetTitle>
          <SheetDescription>
          Create a new vault to organize and track your savings for specific goals.
          </SheetDescription>
        </SheetHeader>
        <VaultForm onSubmit={handleSubmit} defaultValues={{
          isExpendable: false,
          name: "",
          initialMoney: ""
        }} />
      </SheetContent>
    </Sheet>
  );
}
