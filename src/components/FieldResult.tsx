import { Copy, RotateCcw } from "lucide-react";
import { InlineButton } from "@/components/InlineButton";

interface FieldResultProps {
  value: string | undefined;
  onCopyValue: () => void;
  onRegenerateValue: () => void;
}

export function FieldResult({
  value,
  onCopyValue,
  onRegenerateValue
}: FieldResultProps) {
  if (value === undefined) return null;

  const stringValue = String(value);

  return (
    <div className="flex items-center gap-2 ml-0 pl-3 border-l-2 border-primary/30 animate-fade-in group">
      <span className="text-xs font-mono text-primary truncate">
        {stringValue}
      </span>

      <InlineButton
        title="Regerar"
        icon={RotateCcw}
        onClick={onRegenerateValue}
      />

      <InlineButton
        title="Copiar"
        icon={Copy}
        onClick={onCopyValue}
      />
    </div>
  )
}