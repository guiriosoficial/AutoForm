import { useTranslation } from "react-i18next";
import {
  useCallback,
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
import { AlertDialog } from "@/components/shared/AlertDialog";
import { ImportPresetsDialog } from "@/components/ImportPresetsDialog";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { preventDefaultEscape } from "@/lib/events"
import { IMPORT_CONFIG, ImportStrategy } from "@/configs";
import type { ParsePresetsResult } from "@/hooks/use-presets";
import type { Preset } from "@/lib/presets";

interface PresetsManagerProps {
  presets: Preset[];
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset | null) => void;
  onDeletePreset: (presetId: string) => void;
  onCreatePreset: () => void;
  onExportPresets: () => void;
  onImportPresets: (presets: Preset[], strategy?: ImportStrategy) => void;
  onLoadFile: (json: string) => ParsePresetsResult | void;
}

export function PresetsManager({
  presets,
  selectedPreset,
  onSelectPreset,
  onCreatePreset,
  onDeletePreset,
  onExportPresets,
  onImportPresets,
  onLoadFile
}: PresetsManagerProps) {
  const [isPresetSelectorOpen, setIsPresetSelectorOpen] = useState(false);
  const [presetsToImport, setPresetsToImport] = useState<ParsePresetsResult | null>(null);
  const [presetToDelete, setPresetToDelete] = useState<Preset | null>(null);

  const { importStrategy } = useAppSettings();

  const importInputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const handleStartDeletePreset = useCallback((event: MouseEvent<HTMLButtonElement>, preset: Preset) => {
    event.stopPropagation();

    setIsPresetSelectorOpen(false);
    setPresetToDelete(preset)
  }, [setIsPresetSelectorOpen, setPresetToDelete]);

  const handleConfirmDeletePreset = useCallback((presetId: string) => {
    onDeletePreset(presetId);
    setPresetToDelete(null);
  }, [onDeletePreset, setPresetToDelete]);

  const handleLoadPresetsFile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const json = await file.text();

    const loaded = onLoadFile(json);

    if (!loaded) return;

    if (
      presets.length <= IMPORT_CONFIG.REPLACE_ALL_THRESHOLD ||
      importStrategy !== ImportStrategy.ALWAYS_ASK
    ) {
      onImportPresets(loaded.parsed, importStrategy);
      return;
    }

    setPresetsToImport(loaded)
  }, [presets, importStrategy, onLoadFile, onImportPresets]);

  const handleImportPresets = useCallback((imported: Preset[], strategy: ImportStrategy) => {
    onImportPresets(imported, strategy)

    setPresetsToImport(null)
  }, [onImportPresets, setPresetsToImport])

  return (
    <>
      <Combobox
        open={isPresetSelectorOpen}
        value={selectedPreset}
        items={presets}
        itemToStringLabel={preset => preset.name}
        itemToStringValue={preset => preset.id}
        onValueChange={onSelectPreset}
        onOpenChange={setIsPresetSelectorOpen}
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
                      className="absolute top-1/2 -translate-y-1/2 right-2 in-data-[selected]:right-8 opacity-0 in-data-[highlighted]:opacity-100 in-data-[highlighted]:hover:**:text-destructive! **:transition-colors"
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
        } />
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
        <AlertDialog
          destructive
          open={!!presetToDelete}
          description={t("presetsManager.alerts.deletePreset.description", { presetToDelete })}
          onConfirm={() => handleConfirmDeletePreset(presetToDelete.id)}
          onCancel={() => setPresetToDelete(null)}
        />
      )}

      {presetsToImport && (
        <ImportPresetsDialog
          open={!!presetsToImport}
          presetsToImport={presetsToImport}
          onImport={handleImportPresets}
          onOpenChange={() => setPresetsToImport(null)}
        />
      )}

      <input
        ref={importInputRef}
        className="hidden"
        type="file"
        accept={IMPORT_CONFIG.FILE_TYPE}
        onChange={handleLoadPresetsFile}
      />
    </>
  );
}