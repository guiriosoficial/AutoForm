import {FieldRow} from "@/components/FieldRow.tsx";
import {Copy, Plus, RotateCcw} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {FieldConfig} from "@/types/FieldConfig.ts";

interface FormManagerProps {
  fields: FieldConfig[];
  values: Record<string, string>;
  onUpdateField: (id: string, updated: FieldConfig) => void,
  onAddField: () => void,
  onRemoveField: (id: string) => void,
  onCopyValue: (value: string) => void,
  onRegenerateValue: (id: string, type: string) => void,
}

export function FormManager({
  fields,
  values,
  onUpdateField,
  onAddField,
  onRemoveField,
  onCopyValue,
  onRegenerateValue
}: FormManagerProps) {
  return (
    <>
      {fields.map(field => (
        <div
          key={field.id}
          className="space-y-1"
        >
          <FieldRow
            field={field}
            onChange={(updated) => onUpdateField(field.id, updated)}
            onRemove={() => onRemoveField(field.id)}
          />

          {/*TODO: Talvez, componentizar isso*/}
          {values[field.id] && (
            <div className="flex items-center gap-2 ml-0 pl-3 border-l-2 border-primary/30 animate-fade-in group">
              <span className="text-xs font-mono text-primary truncate">
                {values[field.id]}
              </span>

              <button
                onClick={() => onRegenerateValue(field.id, field.methodType)}
                className="shrink-0 text-muted-foreground hover:text-accent opacity-0 group-hover:opacity-100 transition-all"
                title="Regerar"
              >
                <RotateCcw size={12} />
              </button>

              <button
                onClick={() => onCopyValue(values[field.id])}
                className="shrink-0 text-muted-foreground hover:text-accent opacity-0 group-hover:opacity-100 transition-all"
                title="Copiar"
              >
                <Copy size={12} />
              </button>
            </div>
          )}
        </div>
      ))}

      <Button
        variant="ghost"
        className="border border-dashed w-full"
        onClick={onAddField}
      >
        <Plus size={14} />
        Adicionar campo
      </Button>
    </>
  )
}