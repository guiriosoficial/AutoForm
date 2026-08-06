import { useRef, type ChangeEvent } from "react";
import {
  Download,
  Upload,
  Plus,
  EllipsisVertical
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { EXPORT_FILE_EXTENSION } from "@/configs";
import type { Preset } from "@/lib/presets";

interface PresetManagerProps {
  presets: Preset[];
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset | null) => void;
  onDeletePreset: (preset: Preset) => void;
  onCreatePreset: () => void;
  onExport: () => void;
  onImport: (json: string) => void;
}

// TODO:
// - Implementar Delete (No Menu Dropdown ou no Item do Combobox)
// - Implementar edição de nome do Preset
// - Ajustar tamanho do ComboList
export function PresetManager({
  presets,
  selectedPreset,
  onSelectPreset,
  onCreatePreset,
  onExport,
  onImport,
}: PresetManagerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onImport(await file.text());

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
        itemToStringLabel={preset => preset.name}
        itemToStringValue={preset => preset.id}
      >
        <ComboboxInput
          className="flex-1"
          placeholder="Trocar preset... "
        />
        <ComboboxContent>
          <ComboboxEmpty>
            Nenhum preset salvo
          </ComboboxEmpty>
          <ComboboxList>
            {(preset: Preset) => (
              <ComboboxItem
                key={preset.id}
                value={preset}
              >
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
        onClick={onCreatePreset}
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
        accept={EXPORT_FILE_EXTENSION}
        className="hidden"
        onChange={handleImportFile}
      />
    </div>
  );
}