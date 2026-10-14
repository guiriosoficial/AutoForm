import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ImportItem } from "@/components/layouts/ImportItem";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { ImportStrategyIcons } from "@/components/icons/maps";
import { type PartialBy, preventDefaultEscape } from "@/lib/utils";
import {
  IMPORT_CONFIG,
  ImportConflictType,
  ImportConflictOrder,
  ImportStrategy,
} from "@/configs";
import type { Preset } from "@/lib/presets";
import type { CatalogMethod } from "@/lib/catalog";
import type { ParseImportDataResult, ImportPayload, ImportConflict } from "@/hooks/use-import-export";

interface PresetsImportDialogProps {
  open: boolean;
  importPreview: ParseImportDataResult;
  onImportData: (importPayload: ImportPayload, importStrategy: ImportStrategy) => void;
  onOpenChange: (open: boolean) => void;
}

type MappedItemsToImport<T> = PartialBy<ImportConflict<T>, "conflictType" | "reference">[];

export function PresetsImportDialog({
  open,
  importPreview,
  onImportData,
  onOpenChange,
}: PresetsImportDialogProps) {
  const [importStrategy, setImportStrategy] = useState<ImportStrategy>(IMPORT_CONFIG.ASKED_STRATEGY_DEFAULT);

  const { t } = useTranslation();
  const { parsedData, conflicts } = importPreview;

  const hasPresetConflicts = conflicts.presets.length > 0;
  const hasConflicts = hasPresetConflicts || conflicts.customMethods.length > 0;

  const importStrategyOptions = Object.values(ImportStrategy).filter((strategy) =>
    (hasPresetConflicts || strategy !== ImportStrategy.OVERWRITE) &&
    strategy !== ImportStrategy.ALWAYS_ASK
  )

  const mappedPresetsToImport: MappedItemsToImport<Preset> = parsedData.presets.map((preset) => {
    const conflictedItem = conflicts.presets.find((conflict) => conflict.target.id === preset.id);
    return conflictedItem ?? { target: preset };
  })

  const sortedPresetsToImport = mappedPresetsToImport.toSorted(
    (presetA, presetB) =>
      (ImportConflictOrder[presetA.conflictType ?? ImportConflictType.NONE]) -
      (ImportConflictOrder[presetB.conflictType ?? ImportConflictType.NONE]),
  );

  const mappedCustomMethodsToImport: MappedItemsToImport<CatalogMethod> = parsedData.customMethods.map((customMethod) => {
    const conflictedItem = conflicts.customMethods.find((conflict) => conflict.target.key === customMethod.key)
    return conflictedItem ?? { target: customMethod };
  });

  const sortedCustomMethodsToImport = mappedCustomMethodsToImport.toSorted(
    (presetA, presetB) =>
      (ImportConflictOrder[presetA.conflictType ?? ImportConflictType.NONE]) -
      (ImportConflictOrder[presetB.conflictType ?? ImportConflictType.NONE]),
  );

  const handleImportStrategyChange = (nextStrategy: string[]) => {
    if (nextStrategy.length === 0) return;

    setImportStrategy(nextStrategy[0] as ImportStrategy);
  };

  const dialogDescriptionPreset = t("presetsManager.dialogs.importPreset.descriptionPreset", {
    count: conflicts.presets.length,
    total: parsedData.presets.length,
  });

  const dialogDescriptionCustomMethod = parsedData.customMethods.length > 0
    ? `${t("globals.and")} ${t("presetsManager.dialogs.importPreset.descriptionCustomMethod", {
      count: conflicts.customMethods.length,
      total: parsedData.customMethods.length,
    })}`
    : "";

  const dialogDescription = `${dialogDescriptionPreset} ${dialogDescriptionCustomMethod}`

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
          {sortedPresetsToImport.map((preset) => (
            <ImportItem
              key={preset.target.id}
              item={preset}
              type="preset"
              importStrategy={importStrategy}
            />
          ))}
        </div>

        <Separator />

        <div className="space-y-2 ml-4">
          {sortedCustomMethodsToImport.map((customMethod) => (
            <ImportItem
              key={customMethod.target.key}
              item={customMethod}
              type="customMethod"
              importStrategy={importStrategy}
            />
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

        {hasConflicts && (
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50">
            <AlertTriangle />
            <AlertTitle>
              {t("presetsManager.dialogs.importPreset.alerts.conflicts.title")}
            </AlertTitle>
            <AlertDescription>
              {t("presetsManager.dialogs.importPreset.alerts.conflicts.description")}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline">
                {t("presetsManager.dialogs.importPreset.cancelButton")}
              </Button>
            }
          />
          <Button onClick={() => onImportData(parsedData, importStrategy)}>
            {t("presetsManager.dialogs.importPreset.confirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
