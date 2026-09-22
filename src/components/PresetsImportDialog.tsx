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
import type { ParseImportExportResult, ParseJsonResult } from "@/hooks/use-import-export";

interface PresetsImportDialogProps {
  open: boolean;
  importPreview: ParseImportExportResult;
  onOpenChange: (open: boolean) => void;
  onImport: (importedData: ParseJsonResult, importStrategy: ImportStrategy) => void;
}

const importStrategyOptions = Object.values(ImportStrategy)
  .filter(strategy => strategy !== ImportStrategy.ALWAYS_ASK);

export function PresetsImportDialog({
  open,
  importPreview,
  onOpenChange,
  onImport,
}: PresetsImportDialogProps) {
  const [importStrategy, setImportStrategy] = useState<ImportStrategy>(IMPORT_CONFIG.ASKED_STRATEGY_DEFAULT);

  const { t } = useTranslation();

  const { parsed, duplicatedPresets } = importPreview;

  const strategyDescription = t("presetsManager.dialogs.importPreset.description", {
    count: duplicatedPresets.length,
    total: parsed.presets.length,
  });

  const handleChangeImportStrategy = (newStrategy: string[]) => {
    if (newStrategy.length === 0) return;

    setImportStrategy(newStrategy[0] as ImportStrategy);
  };

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
            {strategyDescription}
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
            onValueChange={handleChangeImportStrategy}
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
          <Button onClick={() => onImport(importPreview.parsed, importStrategy)}>
            {t("presetsManager.dialogs.importPreset.confirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
