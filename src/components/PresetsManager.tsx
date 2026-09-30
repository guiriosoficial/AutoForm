import { useTranslation } from "react-i18next";
import { type ChangeEvent, type MouseEvent, useRef, useState } from "react";
import { Download, EllipsisVertical, Plus, Trash, Upload, ArrowDownUp } from "lucide-react";
import { PresetSortingIcons } from "@/components/icons/maps/sorting";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { AlertDialog } from "@/components/shared/AlertDialog";
import { PresetsImportDialog } from "@/components/PresetsImportDialog";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { cn, preventDefaultEscape } from "@/lib/utils";
import { IMPORT_CONFIG, PRESET_CONFIG, ImportStrategy, PresetSorting } from "@/configs";
import type { Preset } from "@/lib/presets";
import type { ParseImportDataResult, ImportPayload } from "@/hooks/use-import-export";

interface PresetsManagerProps {
  presets: Preset[];
  selectedPreset: Preset | null;
  onSelectPreset: (preset: Preset | null) => void;
  onCreatePreset: () => void;
  onDeletePreset: (presetId: string) => void;
  onExportData: () => void;
  onImportData: (importPayload: ImportPayload, importStrategy?: ImportStrategy) => void;
  onParseImportData: (jsonContent: string) => ParseImportDataResult | undefined;
}

const getRemovePresetButtonClass = (index: number) => cn(
  "absolute top-1/2 -translate-y-1/2 right-2 in-data-[selected]:right-8 opacity-0 in-data-[highlighted]:opacity-100 in-data-[highlighted]:hover:**:text-destructive! **:transition-colors",
  index === 0 && "top-auto bottom-2 translate-y-0",
)

const getSelectedPresetCheckClass = (index: number) => cn(
  index === 0 && "[&>span[data-selected]]:bottom-2",
)

export function PresetsManager({
  presets,
  selectedPreset,
  onSelectPreset,
  onCreatePreset,
  onDeletePreset,
  onExportData,
  onImportData,
  onParseImportData,
}: PresetsManagerProps) {
  const [isPresetSelectorOpen, setIsPresetSelectorOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<ParseImportDataResult | null>(null);
  const [presetToDelete, setPresetToDelete] = useState<Preset | null>(null);

  const { importStrategy, presetsSorting, setPresetsSorting } = useAppSettings();

  const importFileInputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const handleRequestDeletePreset = (event: MouseEvent<HTMLButtonElement>, preset: Preset) => {
    event.stopPropagation();

    setIsPresetSelectorOpen(false);
    setPresetToDelete(preset);
  };

  const handleConfirmDeletePreset = (presetId: string) => {
    onDeletePreset(presetId);
    setPresetToDelete(null);
  };

  const handleRequestImportData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const jsonContent = await file.text();

    const parseResult = onParseImportData(jsonContent);

    if (!parseResult) return;

    const shouldSkipConfirmation =
      presets.length <= IMPORT_CONFIG.REPLACE_ALL_THRESHOLD ||
      importStrategy !== ImportStrategy.ALWAYS_ASK;

    if (shouldSkipConfirmation) {
      onImportData(parseResult.parsedData, importStrategy);
      return;
    }

    setImportPreview(parseResult);
  };

  const handleConfirmImportData = (
    importPayload: ImportPayload,
    importStrategySelected: ImportStrategy,
  ) => {
    onImportData(importPayload, importStrategySelected);

    setImportPreview(null);
  };

  return (
    <>
      <Combobox
        open={isPresetSelectorOpen}
        value={selectedPreset}
        items={presets}
        itemToStringLabel={(preset) => preset.name}
        itemToStringValue={(preset) => preset.id}
        onValueChange={onSelectPreset}
        onOpenChange={setIsPresetSelectorOpen}
      >
        <ComboboxInput
          className="flex-1"
          placeholder={t("presetsManager.form.presetSelect.placeholder")}
          onKeyDown={preventDefaultEscape}
        />
        <ComboboxContent>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="absolute right-2 top-2 z-10 transition-opacity opacity-50 hover:opacity-100"
              render={
                <Button
                  variant="secondary"
                  size="icon-xs"
                >
                  <ArrowDownUp />
                </Button>
              }
            />
            <DropdownMenuContent onKeyDown={preventDefaultEscape}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  {t("presetsManager.form.sortingDropdown.label")}
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={presetsSorting}
                  onValueChange={setPresetsSorting}
                >
                  {Object.values(PresetSorting).map((itemSorting) => (
                    <DropdownMenuRadioItem
                      key={itemSorting}
                      value={itemSorting}
                    >
                      <DynamicIcon icon={PresetSortingIcons[itemSorting]} />
                      {t(`configs.preset.sorting.${itemSorting}`)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <ComboboxEmpty>
            {t("presetsManager.form.presetSelect.empty")}
          </ComboboxEmpty>
          <ComboboxList>
            {(preset: Preset, index) => (
              <ComboboxItem
                key={preset.id}
                value={preset}
                className={getSelectedPresetCheckClass(index)}
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
                      className={getRemovePresetButtonClass(index)}
                      type="button"
                      onClick={(event) => handleRequestDeletePreset(event, preset)}
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
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
            >
              <EllipsisVertical />
            </Button>
          }
        />
        <DropdownMenuContent onKeyDown={preventDefaultEscape}>
          <DropdownMenuItem onClick={onExportData}>
            <Download />
            {t("presetsManager.buttons.export")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => importFileInputRef.current?.click()}>
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

      {importPreview && (
        <PresetsImportDialog
          open={!!importPreview}
          importPreview={importPreview}
          onImportData={handleConfirmImportData}
          onOpenChange={() => setImportPreview(null)}
        />
      )}

      <input
        ref={importFileInputRef}
        className="hidden"
        type="file"
        accept={IMPORT_CONFIG.FILE_TYPE}
        onChange={handleRequestImportData}
      />
    </>
  );
}
