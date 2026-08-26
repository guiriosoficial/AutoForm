import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JsonConfigEditor } from "@/components/JsonConfigEditor";
import {
  catalogMethodsById,
  catalogOptions,
  type CatalogModule,
  type CatalogMethod
} from "@/lib/catalog";
import { preventDefaultEscape } from "@/lib/events"
import type { FieldConfig } from "@/lib/fields.ts";

interface FieldRowProps {
  field: FieldConfig;
  onRemove: () => void;
  onUpdate: (updated: FieldConfig) => void;
}

export function FieldEditor({
  field,
  onRemove,
  onUpdate,
}: FieldRowProps) {
  const { t } = useTranslation();

  const selectedMethod = catalogMethodsById.get(field.generator) ?? null;

  const updateField = (
    key: keyof FieldConfig,
    value: string | undefined
  ) => {
    if (value === undefined) return;

    onUpdate({
      ...field,
      [key]: value
    })
  }

  return (
    <div className="grid items-center grid-cols-[1fr_1fr_auto_auto] gap-2">
      <Input
        value={field.selector}
        placeholder={t("fieldsManager.form.selectorInput.placeholder")}
        onChange={(e) => updateField("selector", e.target.value)}
      />

      <Combobox
        items={catalogOptions}
        value={selectedMethod}
        onValueChange={(value) => updateField("generator", value?.value)}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
      >
        <ComboboxInput
          placeholder={t("fieldsManager.form.generatorSelect.placeholder")}
          onKeyDown={preventDefaultEscape}
        />
        <ComboboxContent>
          <ComboboxEmpty>
            {t("fieldsManager.form.generatorSelect.empty")}
          </ComboboxEmpty>
          <ComboboxList>
            {(group: CatalogModule, index) => (
              <ComboboxGroup
                key={group.value}
                items={group.items}
              >
                <ComboboxLabel>
                  {group.value}
                </ComboboxLabel>
                <ComboboxCollection>
                  {(item: CatalogMethod) => (
                    <ComboboxItem
                      key={item.value}
                      value={item}
                    >
                      <span className="block truncate">
                        {item.label}
                      </span>
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
                {index < catalogOptions.length - 1 && <ComboboxSeparator />}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <JsonConfigEditor
        value={field.options}
        docUrl={selectedMethod?.docs}
        onChange={(value) => updateField("options", value)}
      />

      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-destructive/10! hover:text-destructive"
        onClick={onRemove}
      >
        <X size={16} />
      </Button>
    </div>
  );
}