import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { ImportStrategyIcons } from "@/components/icons/maps";
import { preventDefaultEscape } from "@/lib/utils";
import { IMPORT_CONFIG, ImportStrategy } from "@/configs";
import type { ParseImportDataResult, ImportExportData } from "@/hooks/use-import-export";

interface PresetsImportDialogProps {
  open: boolean;
  importPreview: ParseImportDataResult;
  onImportData: (parsedData: ImportExportData, importStrategy: ImportStrategy) => void;
  onOpenChange: (open: boolean) => void;
}

const importStrategyOptions = Object.values(ImportStrategy)
  .filter((strategy) => strategy !== ImportStrategy.ALWAYS_ASK);

export function PresetsImportDialog({
  open,
  importPreview,
  onImportData,
  onOpenChange,
}: PresetsImportDialogProps) {
  const [importStrategy, setImportStrategy] = useState<ImportStrategy>(IMPORT_CONFIG.ASKED_STRATEGY_DEFAULT);

  const { t } = useTranslation();

  const { parsed, duplicatedPresets } = importPreview;

  const handleImportStrategyChange = (nextStrategy: string[]) => {
    if (nextStrategy.length === 0) return;

    setImportStrategy(nextStrategy[0] as ImportStrategy);
  };

  const dialogDescription = t("presetsManager.dialogs.importPreset.description", {
    count: duplicatedPresets.length,
    total: parsed.presets.length,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="max-h-11/12 overflow-y-auto"
        onKeyDown={preventDefaultEscape}
      >
        <DialogHeader>
          <DialogTitle>
            {t("presetsManager.dialogs.importPreset.title")}
          </DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 ml-4">
          {duplicatedPresets.map((preset) => (
            <Item
              key={preset.id}
              size="xs"
              className="p-0 text-destructive list-item marker:text-muted-foreground"
            >
              <ItemContent>
                <ItemTitle className="text-balance" >
                  {preset.name}
                </ItemTitle>
                <ItemDescription>
                  {t("globals.fields", { count: preset.fields.length })}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>

        <Field>
          <FieldLabel>
            {t("presetsManager.dialogs.importPreset.form.strategyToggle.label")}
          </FieldLabel>
          <ToggleGroup
            value={[importStrategy]}
            variant="outline"
            onValueChange={handleImportStrategyChange}
          >
            <ButtonGroup>
              {importStrategyOptions.map((strategy) => (
                <ToggleGroupItem
                  key={strategy}
                  value={strategy}
                >
                  <DynamicIcon icon={ImportStrategyIcons[strategy]} />
                  {t(`configs.importStrategy.${strategy}.title`)}
                </ToggleGroupItem>
              ))}
            </ButtonGroup>
          </ToggleGroup>
          <FieldDescription>
            {t(`configs.importStrategy.${importStrategy}.description`)}
          </FieldDescription>
        </Field>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline">
                {t("presetsManager.dialogs.importPreset.cancelButton")}
              </Button>
            }
          />
          <Button onClick={() => onImportData(parsed, importStrategy)}>
            {t("presetsManager.dialogs.importPreset.confirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
