import { useTranslation } from "react-i18next";
import { Copy, RotateCcw, X } from "lucide-react";
import { InlineButton } from "@/components/shared/InlineButton";
import { FieldOptionsPopover } from "@/components/FieldOptionsPopover.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ComboboxSeparator
} from "@/components/ui/combobox";
import { preventDefaultEscape } from "@/lib/events";
import {
  catalogMethodsById,
  catalogOptions,
  type CatalogModule,
  type CatalogMethod,
} from "@/lib/catalog";
import type { FieldConfig }  from "@/lib/fields";

interface FieldItemProps {
  field: FieldConfig;
  value: string;
  onRemove: (fieldId: string) => void,
  onUpdate: (fieldId: string, newValue: FieldConfig) => void,
  onRegenerateValue: (fieldId: string) => void,
  onCopyValue: (value: string) => void,
}

export function FieldItem({
  field,
  value,
  onRemove,
  onUpdate,
  onCopyValue,
  onRegenerateValue,
}: FieldItemProps) {
  const { t } = useTranslation();

  const selectedMethod = catalogMethodsById.get(field.generator) ?? null;
  const hasValue = value !== undefined;

  const handleUpdateField = (
    key: keyof FieldConfig,
    newValue: string | undefined,
  ) => {
    if (newValue === undefined) return;

    onUpdate(field.id, {
      ...field,
      [key]: newValue
    })
  }

  return (
    <div className="space-y-1">
      <div className="grid items-center grid-cols-[1fr_1fr_auto_auto] gap-3">
        <Input
          value={field.selector}
          placeholder={t("fieldsManager.form.selectorInput.placeholder")}
          onChange={(e) => handleUpdateField("selector", e.target.value)}
        />

        <Combobox
          items={catalogOptions}
          value={selectedMethod}
          onValueChange={(value) => handleUpdateField("generator", value?.value)}
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

        <FieldOptionsPopover
          value={field.options}
          docUrl={selectedMethod?.docs}
          onChange={(value) => handleUpdateField("options", value)}
        />

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10! hover:text-destructive"
          onClick={() => onRemove(field.id)}
        >
          <X size={16} />
        </Button>
      </div>

      {hasValue && (
        <div className="flex items-center gap-2 pl-3 border-l-2 border-primary/30 text-xs font-mono text-primary group">
          <span className="truncate">
            {String(value)}
          </span>
          <InlineButton
            icon={RotateCcw}
            onClick={() => onRegenerateValue(field.id)}
          />
          <InlineButton
            icon={Copy}
            onClick={() => onCopyValue(value)}
          />
        </div>
      )}
    </div>
  );
}
