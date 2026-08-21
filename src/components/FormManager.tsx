import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldEditor } from "@/components/FieldEditor";
import { FieldResult } from "@/components/FieldResult";
import type { FieldConfig }  from "@/lib/fields-config";

interface FormManagerProps {
  fields: FieldConfig[];
  values: Record<string, string>;
  onAddField: () => void,
  onRemoveField: (fieldId: string) => void,
  onUpdateField: (fieldId: string, updated: FieldConfig) => void,
  onRegenerateValue: (fieldId: string) => void,
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
  const { t } = useTranslation();

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

        {/*TODO: Implements error handling for field generation*/}
        <FieldResult
          value={values[field.id]}
          error={undefined}
          onRegenerateValue={() => onRegenerateValue(field.id)}
          onCopyValue={() => onCopyValue(values[field.id])}
        />
      </div>
    ))}

    <Button
      variant="outline"
      className="border-dashed"
      onClick={onAddField}
    >
      <Plus size={14} />
      {t("fieldsManager.buttons.add")}
    </Button>
  </>

}