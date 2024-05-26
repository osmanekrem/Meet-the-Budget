import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { VaultFormValues } from "./vault-form";
import { useVault } from "@/features/vault/hooks/use-vault";
import VaultForm from "./vault-form";
import { useOpenVault } from "../hooks/use-open-vault";
import { useConfirm } from "@/hooks/use-confirm";
import { CreateVault, Vault } from "@/types/app-types";

export default function EditVaultSheet() {

    const {isOpen, onClose, id} = useOpenVault()
    const {getVaultFormValues, editVault, removeVault} = useVault()

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this vault."
  );

  if (!id) return null;

  const vault = getVaultFormValues(id)

  const defaultValues: VaultFormValues = !!vault
  ? vault
  : {
    isExpendable: false,
    name: "",
    initialMoney: ""
  }

const handleSubmit = (values: CreateVault) => {
  editVault(id, values);
  onClose();
};

const handleDelete = async () => {
  const ok = await confirm();

  if (ok) {
    removeVault(id);
    onClose();
  }
};
  return (
    <>
    <ConfirmDialog />
    <Sheet open={isOpen} onOpenChange={onClose}> 
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Vault</SheetTitle>
          <SheetDescription>
          Edit an existing vault.
          </SheetDescription>
        </SheetHeader>
        <VaultForm id={id} onDelete={handleDelete} onSubmit={handleSubmit} defaultValues={defaultValues} />
      </SheetContent>
    </Sheet>
    </>
  );
}
