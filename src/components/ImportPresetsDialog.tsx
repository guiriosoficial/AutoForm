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
import { preventDefaultEscape } from "@/lib/dom";
import { IMPORT_CONFIG, ImportStrategy } from "@/configs";
import type { Preset } from "@/lib/presets";
import type { ParsePresetsResult } from "@/hooks/use-presets";

interface ImportPresetsDialogProps {
  open: boolean;
  presetsToImport: ParsePresetsResult;
  onOpenChange: (open: boolean) => void;
  onImport: (presets: Preset[], strategy: ImportStrategy) => void;
}

const strategyOptions = Object.values(ImportStrategy)
  .filter(strategy => strategy !== ImportStrategy.ALWAYS_ASK);

export function ImportPresetsDialog({
  open,
  presetsToImport,
  onOpenChange,
  onImport,
}: ImportPresetsDialogProps) {
  const [strategy, setStrategy] = useState<ImportStrategy>(IMPORT_CONFIG.ASKED_STRATEGY_DEFAULT);

  const { t } = useTranslation();

  const { parsed, duplicated } = presetsToImport;

  const strategyDescription = t("presetsManager.dialogs.importPreset.description", {
    count: duplicated.length,
    total: parsed.length,
  });

  const handleChangeImportStrategy = (newStrategy: string[]) => {
    if (newStrategy.length === 0) return;

    setStrategy(newStrategy[0] as ImportStrategy);
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
          {duplicated.map((preset) => (
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
            value={[strategy]}
            variant="outline"
            onValueChange={handleChangeImportStrategy}
          >
            <ButtonGroup>
              {strategyOptions.map((value) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                >
                  <DynamicIcon icon={ImportStrategyIcons[value]} />
                  {t(`configs.importStrategy.${value}.title`)}
                </ToggleGroupItem>
              ))}
            </ButtonGroup>
          </ToggleGroup>
          <FieldDescription>
            {t(`configs.importStrategy.${strategy}.description`)}
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
          <Button onClick={() => onImport(presetsToImport.parsed, strategy)}>
            {t("presetsManager.dialogs.importPreset.confirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
