import { useTranslation } from "react-i18next";
import {
  useState,
  useRef,
  type MouseEvent,
  type ChangeEvent
} from "react";
import {
  Download,
  Upload,
  Plus,
  Trash,
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
  ItemTitle,
  ItemActions
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { ConfirmationAlertDialog } from "@/components/ConfirmationAlertDialog.tsx";
import { ImportPresetDialog } from "@/components/ImportPresetDialog";
import { preventDefaultEscape } from "@/lib/utils";
import {
  IMPORT_CONFIG,
  type ImportStrategy
} from "@/configs";
import type { ParsePresetsResult } from "@/hooks/use-presets";
import type { Preset } from "@/lib/presets";

interface PresetManagerProps {
  presets: Preset[];
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset | null) => void;
  onDeletePreset: (presetId: string) => void;
  onCreatePreset: () => void;
  onExportPresets: () => void;
  onImportPresets: (presets: Preset[], strategy?: ImportStrategy) => Promise<void>;
  onLoadFile: (json: string) => Promise<ParsePresetsResult | null>;
}

export function PresetManager({
  presets,
  selectedPreset,
  onSelectPreset,
  onCreatePreset,
  onDeletePreset,
  onExportPresets,
  onImportPresets,
  onLoadFile
}: PresetManagerProps) {
  const [isPresetSelectorOpen, setIsPresetSelectorOpen] = useState(false);
  const [presetsToImport, setPresetsToImport] = useState<ParsePresetsResult | null>(null);
  const [presetToDelete, setPresetToDelete] = useState<Preset | null>(null);

  const importInputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const handleConfirmDeletePreset = (presetId: string) => {
    onDeletePreset(presetId);
    setPresetToDelete(null);
  }

  const handleStartDeletePreset = (event: MouseEvent<HTMLButtonElement>, preset: Preset) => {
    event.stopPropagation();

    setIsPresetSelectorOpen(false);
    setPresetToDelete(preset)
  }

  const handleLoadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const json = await file.text();

    const loaded = await onLoadFile(json);

    if (loaded && presets.length <= IMPORT_CONFIG.REPLACE_ALL_THRESHOLD) {
      await onImportPresets(loaded.parsed);
      return
    }

    setPresetsToImport(loaded)
  }

  const handleImportPreset = async (presets: Preset[], strategy: ImportStrategy) => {
    await onImportPresets(presets, strategy)

    setPresetsToImport(null)
  }

  const deleteButtonClasses = "absolute top-1/2 -translate-y-1/2 right-2 in-data-[selected]:right-8 opacity-0 in-data-[highlighted]:opacity-100 in-data-[highlighted]:hover:**:text-destructive! **:transition-colors"

  return (
    <div className="flex items-center gap-2">
      <Combobox
        open={isPresetSelectorOpen}
        value={selectedPreset}
        items={presets}
        itemToStringLabel={preset => preset.name}
        itemToStringValue={preset => preset.id}
        onOpenChange={setIsPresetSelectorOpen}
        onValueChange={onSelectPreset}
      >
        <ComboboxInput
          className="flex-1"
          placeholder={t("presetsManager.form.presetSelect.placeholder")}
          onKeyDown={preventDefaultEscape}
        />
        <ComboboxContent>
          <ComboboxEmpty>
            {t("presetsManager.form.presetSelect.empty")}
          </ComboboxEmpty>
          <ComboboxList>
            {(preset: Preset) => (
              <ComboboxItem
                key={preset.id}
                value={preset}
              >
                <Item
                  size="sm"
                  className="p-0"
                >
                  <ItemContent>
                    <ItemTitle>
                      {preset.name}
                    </ItemTitle>
                    <ItemDescription>
                      {t("globals.fields", { count: preset.fields.length })}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <button
                      className={deleteButtonClasses}
                      onClick={(event) => handleStartDeletePreset(event, preset)}
                    >
                      <Trash />
                    </button>
                  </ItemActions>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Button
        className="pr-4 pl-3"
        onClick={onCreatePreset}
      >
        <Plus />
        {t("presetsManager.buttons.new")}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button
            variant="outline"
            size="icon"
          >
            <EllipsisVertical />
          </Button>
        }/>
        <DropdownMenuContent onKeyDown={preventDefaultEscape}>
          <DropdownMenuItem onClick={onExportPresets}>
            <Download />
            {t("presetsManager.buttons.export")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => importInputRef.current?.click()}>
            <Upload />
            {t("presetsManager.buttons.import")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {presetToDelete && (
        <ConfirmationAlertDialog
          destructive
          open={!!presetToDelete}
          description={t("presetsManager.alerts.deletePreset.description", { presetToDelete })}
          onConfirm={() => handleConfirmDeletePreset(presetToDelete.id)}
          onCancel={() => setPresetToDelete(null)}
        />
      )}

      {presetsToImport && (
        <ImportPresetDialog
          open={!!presetsToImport}
          presetsToImport={presetsToImport}
          onImport={handleImportPreset}
          onOpenChange={() => setPresetsToImport(null)}
        />
      )}

      <input
        ref={importInputRef}
        className="hidden"
        type="file"
        accept={IMPORT_CONFIG.FILE_TYPE}
        onChange={handleLoadFile}
      />
    </div>
  );
}