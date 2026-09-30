import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sortable } from "@/components/ui/sortable";
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
  onSortFields: (nextFields: FieldConfig[]) => void;
  onRegenerateFieldValue: (fieldId: string) => void;
  onCopyGeneratedValue: (generatedValue: string) => void;
}

export function FieldsManager({
  generatedValues,
  fields,
  onAddField,
  onRemoveField,
  onUpdateField,
  onSortFields,
  onRegenerateFieldValue,
  onCopyGeneratedValue,
}: FieldsManagerProps) {
  const { t } = useTranslation();

  return (
    <Sortable
      value={fields}
      onValueChange={onSortFields}
      getItemValue={(item) => item.id}
      strategy="vertical"
      className="space-y-5"
    >
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
        className="border-dashed w-full"
        variant="outline"
        onClick={onAddField}
      >
        <Plus size={IconSize.SM} />
        {t("fieldsManager.buttons.add")}
      </Button>
    </Sortable>
  );
}
