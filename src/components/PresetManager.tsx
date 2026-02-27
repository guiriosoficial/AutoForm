import { useState, useRef } from "react";
import {Save, Trash2, Download, Upload, Pencil, Check, X, EllipsisVertical, Plus} from "lucide-react";
import type { Preset, FieldConfig } from "@/lib/faker-options";
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList
} from "@/components/ui/combobox.tsx";
import {Item, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {cn} from "@/lib/utils.ts";

interface PresetManagerProps {
    presets: Preset[];
    currentFields: FieldConfig[];
    onLoad: (fields: FieldConfig[]) => void;
    onSave: (preset: Preset) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updated: Partial<Preset>) => void;
    onExport: () => void;
    onImport: (json: string) => boolean;
}

export function PresetManager({
                                  presets,
                                  currentFields,
                                  onLoad,
                                  onSave,
                                  onDelete,
                                  onUpdate,
                                  onExport,
                                  onImport,
                              }: PresetManagerProps) {
    const [selectedId, setSelectedId] = useState<Preset>({} as Preset);
    const [saveName, setSaveName] = useState("");
    const [showSave, setShowSave] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (!saveName.trim() || currentFields.length === 0) return;
        onSave({
            id: crypto.randomUUID(),
            name: saveName.trim(),
            fields: currentFields,
            createdAt: Date.now(),
        });
        setSaveName("");
        setShowSave(false);
    };

    const handleLoad = (preset: Preset | null) => {
        if (preset) {
            onLoad(preset.fields.map(f => ({ ...f, id: crypto.randomUUID() })));
            setSelectedId(preset);
        }
    };

    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            onImport(reader.result as string);
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const startEdit = (preset: Preset) => {
        setEditingId(preset.id);
        setEditName(preset.name);
    };

    const confirmEdit = () => {
        if (editingId && editName.trim()) {
            onUpdate(editingId, { name: editName.trim() });
            setEditingId(null);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Combobox
                items={presets}
                value={selectedId}
                onValueChange={handleLoad}
                itemToStringLabel={(preset: (typeof presets)[number]) => preset.name}
                itemToStringValue={(preset: (typeof presets)[number]) => preset.id}
            >
                <ComboboxInput className="flex-1" placeholder="Trocar preset... "/>
                <ComboboxContent>
                    <ComboboxEmpty>Nenhum preset salvo</ComboboxEmpty>
                    <ComboboxList>
                        {(preset) => (
                          <ComboboxItem key={preset.id} value={preset}>
                              <Item size="sm" className="p-0">
                                  <ItemContent>
                                      <ItemTitle>
                                          {preset.name}
                                      </ItemTitle>
                                      <ItemDescription>
                                          {preset.fields.length} Campos
                                      </ItemDescription>
                                  </ItemContent>
                              </Item>
                          </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>

            <Button
              onClick={() => setShowSave(!showSave)}
              className="shrink-0 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
              title="Salvar preset"
            >
                <Plus />
                Novo
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                      variant="outline"
                      size="icon"
                    >
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={onExport}>
                        <Download />
                        Exportar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => fileRef.current?.click()}>
                        <Upload />
                        Importar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
        </div>
    );
}
