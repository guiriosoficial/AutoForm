import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldItem } from "@/components/FieldItem";
import type { FieldConfig }  from "@/lib/fields";

interface FieldsManagerProps {
  fields: FieldConfig[];
  values: Record<string, string>;
  onAddField: () => void,
  onRemoveField: (fieldId: string) => void,
  onUpdateField: (fieldId: string, updated: FieldConfig) => void,
  onRegenerateValue: (fieldId: string) => void,
  onCopyValue: (value: string) => void,
}

export function FieldsManager({
  fields,
  values,
  onAddField,
  onRemoveField,
  onUpdateField,
  onRegenerateValue,
  onCopyValue
}: FieldsManagerProps) {
  const { t } = useTranslation();

  return (
    <>
      {fields.map((field) => (
        <FieldItem
          key={field.id}
          field={field}
          value={values[field.id]}
          onUpdate={onUpdateField}
          onRemove={onRemoveField}
          onRegenerateValue={onRegenerateValue}
          onCopyValue={onCopyValue}
        />
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
  );
}
