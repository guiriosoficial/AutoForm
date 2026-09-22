import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldItem } from "@/components/FieldItem";
import { IconSize } from "@/configs";
import type { GeneratedValues } from "@/hooks/use-form";
import type { FieldConfig } from "@/lib/fields";

interface FieldsManagerProps {
  generatedValues: GeneratedValues;
  fields: FieldConfig[];
  onAddField: () => void;
  onRemoveField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, updatedField: FieldConfig) => void;
  onRegenerateValue: (fieldId: string) => void;
  onCopyValue: (value: string) => void;
}

export function FieldsManager({
  generatedValues,
  fields,
  onAddField,
  onRemoveField,
  onUpdateField,
  onRegenerateValue,
  onCopyValue,
}: FieldsManagerProps) {
  const { t } = useTranslation();

  return (
    <>
      {fields.map((field) => (
        <FieldItem
          key={field.id}
          field={field}
          generatedValue={generatedValues[field.id]?.value}
          error={generatedValues[field.id]?.error}
          onUpdateField={onUpdateField}
          onRemoveField={onRemoveField}
          onCopyGeneratedValue={onCopyValue}
          onRegenerateValue={onRegenerateValue}
        />
      ))}

      <Button
        variant="outline"
        className="border-dashed"
        onClick={onAddField}
      >
        <Plus size={IconSize.SM} />
        {t("fieldsManager.buttons.add")}
      </Button>
    </>
  );
}
