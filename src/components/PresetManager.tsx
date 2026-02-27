import { useRef } from "react";
import { Download, Upload, Plus, EllipsisVertical } from "lucide-react";
import type { Preset } from "@/lib/faker-options";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle
} from "@/components/ui/item";

interface PresetManagerProps {
  presets: Preset[];
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset | null) => void;
  onDeletePreset: (preset: Preset) => void;
  onCreateNewPreset: () => void;
  onExport: () => void;
  onImport: (json: string) => boolean;
}

export function PresetManager({
  presets,
  selectedPreset,
  onSelectPreset,
  onCreateNewPreset,
  onExport,
  onImport,
}: PresetManagerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleImportClick = () => {
    fileRef.current?.click()
  }

  return (
    <div className="flex items-center gap-2">
      <Combobox
        items={presets}
        value={selectedPreset}
        onValueChange={onSelectPreset}
        itemToStringLabel={(preset: (typeof presets)[number]) => preset.name}
        itemToStringValue={(preset: (typeof presets)[number]) => preset.id}
      >
        <ComboboxInput
          className="flex-1"
          placeholder="Trocar preset... "
        />
        <ComboboxContent>
          <ComboboxEmpty>Nenhum preset salvo</ComboboxEmpty>
          <ComboboxList>
            {(preset) => (
              <ComboboxItem key={preset.id} value={preset}>
                <Item size="sm" className="p-0">
                  <ItemContent>
                    <ItemTitle>{preset.name}</ItemTitle>
                    <ItemDescription>{preset.fields.length} Campos</ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Button
        onClick={onCreateNewPreset}
        title="Criar novo preset"
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
          <DropdownMenuItem onClick={handleImportClick}>
            <Upload />
            Importar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportFile}
      />
    </div>
  );
}