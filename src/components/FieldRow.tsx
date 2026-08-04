import { X } from "lucide-react";
import {CATALOG, Catalog, CATALOG_METHODS_BY_VALUE, CatalogMethod} from "@/lib/faker-options";
import { JsonConfigEditor } from "@/components/JsonConfigEditor";
import { Input } from "@/components/ui/input.tsx";
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
import { Button } from "@/components/ui/button.tsx";
import type { FieldConfig } from "@/types/FieldConfig.ts";

interface FieldRowProps {
  field: FieldConfig;
  onChange: (updated: FieldConfig) => void;
  onRemove: () => void;
}

export function FieldRow({
  field,
  onChange,
  onRemove,
}: FieldRowProps) {
  const localValue = CATALOG_METHODS_BY_VALUE[field.methodType];

  const handleChangeField = (
    key: keyof FieldConfig,
    value: string
  ) => {
    onChange({
      ...field,
      [key]: value
    })
  }

  return (
    <div className="grid items-center grid-cols-[1fr_1fr_auto_auto] gap-2 animate-fade-in">
      <Input
        type="text"
        value={field.selectorString}
        onChange={(e) => handleChangeField('selectorString', e.target.value)}
        placeholder=".classe / #id / [data-test]"
      />

      {/* TODO: Adicionar Filtro*/}
      {/* TODO: Ajustar Scroll*/}
      <Combobox
        items={CATALOG}
        value={localValue}
        onValueChange={(value) => handleChangeField('methodType', value!.value)}
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
                <ComboboxLabel>{group.category}</ComboboxLabel>
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
                {index < CATALOG.length - 1 && <ComboboxSeparator />}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <JsonConfigEditor
        value={field.config}
        onChange={(value) => handleChangeField('config', value)}
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