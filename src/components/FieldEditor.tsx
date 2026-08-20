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
  CATALOG_METHODS_BY_VALUE,
  AutoFormCatalog,
  type CatalogModule,
  type CatalogMethod
} from "@/lib/main-catalog";
import { preventDefaultEscape } from "@/lib/utils";
import type { FieldConfig } from "@/lib/fields-config";

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

  const selectedMethod = CATALOG_METHODS_BY_VALUE[field.generator];

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
        placeholder={t("input_field_selector_placeholder")}
        onChange={(e) => updateField("selector", e.target.value)}
      />

      <Combobox
        items={AutoFormCatalog}
        value={selectedMethod}
        onValueChange={(value) => updateField("generator", value?.value)}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
      >
        <ComboboxInput
          placeholder={t("select_field_generator_placeholder")}
          onKeyDown={preventDefaultEscape}
        />
        <ComboboxContent>
          <ComboboxEmpty>
            {t("select_generator_empty")}
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
                {index < AutoFormCatalog.length - 1 && <ComboboxSeparator />}
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