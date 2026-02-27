import { X } from "lucide-react";
import { FAKER_OPTIONS, FAKER_CATEGORIES, type FieldConfig } from "@/lib/faker-options";
import { JsonConfigEditor } from "@/components/JsonConfigEditor";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";

interface FieldRowProps {
  field: FieldConfig;
  onChange: (updated: FieldConfig) => void;
  onRemove: () => void;
  onBlur?: () => void;
}

export function FieldRow({ field, onChange, onRemove, onBlur }: FieldRowProps) {
  return (
    <div className="grid items-center grid-cols-[1fr_1fr_auto_auto] gap-2 animate-fade-in">
      <Input
        type="text"
        value={field.selector}
        onChange={e => onChange({ ...field, selector: e.target.value })}
        onBlur={onBlur}
        placeholder=".classe / #id / [data-x]"
      />

      <Select
        value={field.fakerType}
        onValueChange={e => {
          onChange({ ...field, fakerType: e });
          onBlur?.(); // select não tem blur confiável; salvamos ao escolher.
        }}
      >
        <SelectTrigger onBlur={onBlur}>
          <SelectValue placeholder="Data" />
        </SelectTrigger>
        <SelectContent>
          {FAKER_CATEGORIES.map(cat => (
            <SelectGroup key={cat}>
              <SelectLabel>{cat}</SelectLabel>
              {FAKER_OPTIONS.filter(o => o.category === cat).map(o => (
                <SelectItem
                  key={o.value}
                  value={o.value}
                >
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <JsonConfigEditor
        value={field.config || ""}
        onChange={config => onChange({ ...field, config })}
        onBlur={onBlur}
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