import { memo, useRef } from "react";
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
import { type FieldSetupPopoverRef, FieldSetupPopover } from "@/components/FieldSetupPopover";
import { InlineButton } from "@/components/shared/InlineButton";
import { useCatalog } from "@/providers/CatalogProvider";
import { cn, preventDefaultEscape } from "@/lib/utils";
import { CATALOG_CONFIG, EditorTabs, IconSize } from "@/configs";
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

function FieldItemComponent({
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
    createCustomMethod,
    catalogMethodsByKey,
    catalogOptions,
  } = useCatalog();

  const fieldOptionsPopoverRef = useRef<FieldSetupPopoverRef>(null);

  const selectedMethod = catalogMethodsByKey.get(field.generator) ?? null;
  const hasValue = value !== undefined;

  const handleUpdateField = (
    key: keyof FieldConfig,
    newValue: string | undefined,
  ) => {
    if (!newValue) return;

    onUpdate(field.id, {
      ...field,
      [key]: newValue,
    });
  };

  const handleCreateCustomMethod = () => {
    const newMethod = createCustomMethod();

    handleUpdateField("generator", newMethod.key);

    fieldOptionsPopoverRef.current?.startEditing(EditorTabs.METHOD);
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
          itemToStringLabel={(item) => item.name}
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
                      <Button
                        key={item.key}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={handleCreateCustomMethod}
                      >
                        {t("fieldsManager.form.generatorSelect.addOption")}
                        <Plus size={IconSize.SM} />
                      </Button>
                      ) : (
                      <ComboboxItem
                        key={item.key}
                        value={item}
                      >
                        <span className="block truncate">
                          {item.name}
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

        <FieldSetupPopover
          ref={fieldOptionsPopoverRef}
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
          <X size={IconSize.MD} />
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

export const FieldItem = memo(FieldItemComponent)

FieldItem.displayName = "FieldItem";
