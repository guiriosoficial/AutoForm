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
  onUpdateField: (fieldId: string, nextField: FieldConfig) => void;
  onRegenerateFieldValue: (fieldId: string) => void;
  onCopyGeneratedValue: (generatedValue: string) => void;
}

export function FieldsManager({
  generatedValues,
  fields,
  onAddField,
  onRemoveField,
  onUpdateField,
  onRegenerateFieldValue,
  onCopyGeneratedValue,
}: FieldsManagerProps) {
  const { t } = useTranslation();

  return (
    <>
      {fields.map((field) => (
        <FieldItem
          key={field.id}
          field={field}
          error={generatedValues[field.id]?.error}
          generatedValue={generatedValues[field.id]?.value}
          onUpdateField={onUpdateField}
          onRemoveField={onRemoveField}
          onCopyGeneratedValue={onCopyGeneratedValue}
          onRegenerateFieldValue={onRegenerateFieldValue}
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
