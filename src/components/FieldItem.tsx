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
  error: FieldError | undefined;
  generatedValue: GeneratorValue;
  onRemoveField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, nextField: FieldConfig) => void;
  onRegenerateFieldValue: (fieldId: string) => void;
  onCopyGeneratedValue: (generatedValue: string) => void;
}

function FieldItemComponent({
  field,
  error,
  generatedValue,
  onRemoveField,
  onUpdateField,
  onCopyGeneratedValue,
  onRegenerateFieldValue,
}: FieldItemProps) {
  const { t } = useTranslation();
  const {
    createCustomMethod,
    catalogMethodsByKey,
    catalogOptions,
  } = useCatalog();

  const fieldOptionsPopoverRef = useRef<FieldSetupPopoverRef>(null);

  const selectedMethod = catalogMethodsByKey.get(field.generator) ?? null;
  const hasGeneratedValue = generatedValue !== undefined;

  const handleUpdateField = (
    propertyKey: keyof FieldConfig,
    nextValue: string | undefined,
  ) => {
    if (!nextValue) return;

    onUpdateField(field.id, {
      ...field,
      [propertyKey]: nextValue,
    });
  };

  const handleCreateCustomMethod = () => {
    const newCustomMethod = createCustomMethod();

    handleUpdateField("generator", newCustomMethod.key);

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
          onValueChange={(nextGenerator) => handleUpdateField("generator", nextGenerator?.key)}
          itemToStringLabel={(method) => method.name}
          itemToStringValue={(method) => method.key}
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
              {(module: CatalogModule, moduleIndex) => (
                <ComboboxGroup
                  key={module.value}
                  items={module.items}
                >
                  <ComboboxLabel>
                    {module.value}
                  </ComboboxLabel>
                  <ComboboxCollection>
                    {(method: CatalogMethod) => method.key === CATALOG_CONFIG.CUSTOM_NEW_METHOD_KEY ? (
                      <Button
                        key={method.key}
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
                        key={method.key}
                        value={method}
                      >
                        <span className="block truncate">
                          {method.name}
                        </span>
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>

                  {moduleIndex < catalogOptions.length - 1 && <ComboboxSeparator />}
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <FieldSetupPopover
          ref={fieldOptionsPopoverRef}
          options={field.options}
          method={selectedMethod}
          onOptionsChange={(nextOptions) => handleUpdateField("options", nextOptions)}
        />

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10! hover:text-destructive"
          onClick={() => onRemoveField(field.id)}
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
            onClick={() => onRegenerateFieldValue(field.id)}
          />
        </div>
      )}

      {hasGeneratedValue && (
        <div className={resultClasses}>
          <span className="truncate">
            {String(generatedValue)}
          </span>
          <InlineButton
            icon={RotateCcw}
            onClick={() => onRegenerateFieldValue(field.id)}
          />
          <InlineButton
            icon={Copy}
            onClick={() => onCopyGeneratedValue(String(generatedValue))}
          />
        </div>
      )}
    </div>
  );
}

export const FieldItem = memo(FieldItemComponent);

FieldItem.displayName = "FieldItem";
