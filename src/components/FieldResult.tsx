import { Copy, RotateCcw } from "lucide-react";
import { ButtonInline } from "@/components/shared/ButtonInline.tsx";
import { cn } from "@/lib/utils";

interface FieldResultProps {
  value: string | undefined;
  error: string | undefined;
  onCopyValue: () => void;
  onRegenerateValue: () => void;
}

export function FieldResult({
  value,
  error,
  onCopyValue,
  onRegenerateValue
}: FieldResultProps) {
  if (value === undefined && error === undefined) return null;

  const stringValue = String(value);
  const text = error ?? stringValue;
  const resultClasses = cn(
    "flex items-center gap-2 pl-3 border-l-2 text-xs font-mono group",
    error ? "border-destructive/30 text-destructive" : "border-primary/30 text-primary"
  );

  return (
    <div className={resultClasses}>
      <span className="truncate">
        {text}
      </span>
      <ButtonInline
        icon={RotateCcw}
        onClick={onRegenerateValue}
      />
      {!error && (
        <ButtonInline
          icon={Copy}
          onClick={onCopyValue}
        />
      )}
    </div>
  )
}