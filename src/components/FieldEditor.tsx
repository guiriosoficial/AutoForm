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
  FakerCatalog,
  CATALOG_METHODS_BY_VALUE,
  type Catalog,
  type CatalogMethod
} from "@/lib/faker-catalog.ts";
import type { FieldConfig } from "@/lib/fieldsConfig";

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
  const selectedMethod = CATALOG_METHODS_BY_VALUE[field.generator];

  const updateField = (
    key: keyof FieldConfig,
    value: string
  ) => {
    onUpdate({
      ...field,
      [key]: value
    })
  }

  return (
    <div className="grid items-center grid-cols-[1fr_1fr_auto_auto] gap-2 animate-fade-in">
      <Input
        type="text"
        value={field.selector}
        onChange={(e) => updateField('selector', e.target.value)}
        placeholder=".classe / #id / [data-test]"
      />

      {/* TODO: Adicionar Filtro*/}
      <Combobox
        items={FakerCatalog}
        value={selectedMethod}
        onValueChange={(value) => updateField('generator', value?.value ?? '')}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
      >
        <ComboboxInput placeholder="Select a type" />
        <ComboboxContent>
          <ComboboxEmpty>
            No method found.
          </ComboboxEmpty>
          <ComboboxList>
            {(group: Catalog, index) => (
              <ComboboxGroup
                key={group.category}
                items={group.methods}
              >
                <ComboboxLabel>
                  {group.category}
                </ComboboxLabel>
                <ComboboxCollection>
                  {(item: CatalogMethod) => (
                    <ComboboxItem
                      key={item.value}
                      value={item}
                    >
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
                {index < FakerCatalog.length - 1 && <ComboboxSeparator />}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <JsonConfigEditor
        value={field.options}
        onChange={(value) => updateField('options', value)}
      />

      <Button
        variant="ghost"
        size="icon"
        title="Remover campo"
        className="hover:bg-destructive/15 hover:text-destructive"
        onClick={onRemove}
      >
        <X size={16} />
      </Button>
    </div>
  );
}