import { useTranslation } from "react-i18next";
import { Copy, Plus, RotateCcw, X } from "lucide-react";
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
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldOptionsPopover } from "@/components/FieldOptionsPopover";
import { InlineButton } from "@/components/shared/InlineButton";
import { useCatalog } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";
import { preventDefaultEscape } from "@/lib/dom";
import { CATALOG_CONFIG } from "@/configs";
import type { CatalogMethod, CatalogModule } from "@/lib/catalog";
import type { FieldConfig, FieldError } from "@/lib/fields";
import type { GeneratorValue } from "@/lib/generator";

interface FieldItemProps {
  field: FieldConfig;
  value: GeneratorValue;
  error: FieldError | undefined;
  onRemove: (fieldId: string) => void;
  onUpdate: (fieldId: string, newValue: FieldConfig) => void;
  onRegenerateValue: (fieldId: string) => void;
  onCopyValue: (value: string) => void;
}

export function FieldItem({
  field,
  value,
  error,
  onRemove,
  onUpdate,
  onCopyValue,
  onRegenerateValue,
}: FieldItemProps) {
  const { t } = useTranslation();
  const {
    catalogMethodsByKey,
    catalogOptions,
    createCustomMethod,
  } = useCatalog();

  const selectedMethod = catalogMethodsByKey.get(field.generator) ?? null;
  const hasValue = value !== undefined;

  const handleUpdateField = (
    key: keyof FieldConfig,
    newValue: string | undefined,
  ) => {
    if (newValue === undefined) return;

    onUpdate(field.id, {
      ...field,
      [key]: newValue,
    });
  };

  const handleCreateCustomMethod = () => {
    const newMethod = createCustomMethod();

    handleUpdateField("generator", newMethod.key);
  };

  const resultClasses = "flex items-center gap-2 pl-3 border-l-2 text-xs font-mono group border-primary/30 text-primary";
  const resultErrorClasses = cn(resultClasses, "border-destructive/30 text-destructive");

  return (
    <div className="space-y-1">
      <div className="grid items-center grid-cols-[1fr_1fr_auto_auto] gap-3">
        <Input
          value={field.selector}
          placeholder={t("fieldsManager.form.selectorInput.placeholder")}
          onChange={(evt) => handleUpdateField("selector", evt.target.value)}
        />

        <Combobox
          items={catalogOptions}
          value={selectedMethod}
          onValueChange={(newValue) => handleUpdateField("generator", newValue?.key)}
          itemToStringLabel={(item) => item.label}
          itemToStringValue={(item) => item.key}
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
                    {(item: CatalogMethod) => item.key === CATALOG_CONFIG.CUSTOM_NEW_METHOD_KEY ? (
                      <ComboboxItem
                        key={item.key}
                        onClick={handleCreateCustomMethod}
                      >
                        <Plus />
                        {t("fieldsManager.form.generatorSelect.addOption")}
                      </ComboboxItem>
                    ) : (
                      <ComboboxItem
                        key={item.key}
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
          methodKey={field.generator}
          docUrl={selectedMethod?.docs}
          onChange={(newValue) => handleUpdateField("options", newValue)}
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

      {error?.message && (
        <div className={resultErrorClasses}>
          <span className="truncate">
            {error.message}
          </span>
          <InlineButton
            icon={RotateCcw}
            onClick={() => onRegenerateValue(field.id)}
          />
        </div>
      )}

      {hasValue && (
        <div className={resultClasses}>
          <span className="truncate">
            {String(value)}
          </span>
          <InlineButton
            icon={RotateCcw}
            onClick={() => onRegenerateValue(field.id)}
          />
          <InlineButton
            icon={Copy}
            onClick={() => onCopyValue(String(value))}
          />
        </div>
      )}
    </div>
  );
}
