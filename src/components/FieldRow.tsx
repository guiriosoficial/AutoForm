import { X } from "lucide-react";
import { FAKER_OPTIONS, FAKER_CATEGORIES, type FieldConfig } from "@/lib/faker-options";
import { JsonConfigEditor } from "@/components/JsonConfigEditor";

interface FieldRowProps {
    field: FieldConfig;
    onChange: (updated: FieldConfig) => void;
    onRemove: () => void;
}

export function FieldRow({ field, onChange, onRemove }: FieldRowProps) {
    return (
        <div className="flex items-center gap-2 animate-fade-in">
            <input
                type="text"
                value={field.selector}
                onChange={e => onChange({ ...field, selector: e.target.value })}
                placeholder=".classe / #id / [data-x]"
                className="flex-1 min-w-0 h-9 rounded-md border border-border bg-input px-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <select
                value={field.fakerType}
                onChange={e => onChange({ ...field, fakerType: e.target.value })}
                className="flex-1 min-w-0 h-9 rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
            >
                <option value="">Selecione o tipo...</option>
                {FAKER_CATEGORIES.map(cat => (
                    <optgroup key={cat} label={cat}>
                        {FAKER_OPTIONS.filter(o => o.category === cat).map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <JsonConfigEditor
                value={field.config || ""}
                onChange={config => onChange({ ...field, config })}
            />
            <button
                onClick={onRemove}
                className="shrink-0 h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Remover campo"
            >
                <X size={16} />
            </button>
        </div>
    );
}