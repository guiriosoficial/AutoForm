import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldEditor } from "@/components/FieldEditor";
import { FieldResult } from "@/components/FieldResult";
import type { FieldConfig }  from "@/lib/fieldsConfig";

interface FormManagerProps {
  fields: FieldConfig[];
  values: Record<string, string>;
  onAddField: () => void,
  onRemoveField: (id: string) => void,
  onUpdateField: (id: string, updated: FieldConfig) => void,
  onRegenerateValue: (id: string, type: string) => void,
  onCopyValue: (value: string) => void,
}

export function FormManager({
  fields,
  values,
  onAddField,
  onRemoveField,
  onUpdateField,
  onRegenerateValue,
  onCopyValue
}: FormManagerProps) {
  return <>
    {fields.map(field => (
      <div
        key={field.id}
        className="space-y-1"
      >
        <FieldEditor
          field={field}
          onRemove={() => onRemoveField(field.id)}
          onUpdate={(updated) => onUpdateField(field.id, updated)}
        />

        <FieldResult
          value={values[field.id]}
          onRegenerateValue={() => onRegenerateValue(field.id, field.methodType)}
          onCopyValue={() => onCopyValue(values[field.id])}
        />
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

}