import { useTranslation } from "react-i18next";
import { useState} from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle
} from "@/components/ui/item.tsx";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { ButtonGroup } from "@/components/ui/button-group";
import { preventDefaultEscape } from "@/lib/events"
import { IMPORT_CONFIG, ImportStrategy } from "@/configs";
import type { Preset } from "@/lib/presets";
import type { ParsePresetsResult } from "@/hooks/use-presets";

interface ImportPresetDialogProps {
  open: boolean;
  presetsToImport: ParsePresetsResult;
  onOpenChange: (open: boolean) => void;
  onImport: (presets: Preset[], strategy: ImportStrategy) => void;
}

export function ImportPresetDialog({
  open,
  presetsToImport,
  onOpenChange,
  onImport
}: ImportPresetDialogProps) {
  const [strategy, setStrategy] = useState<ImportStrategy[]>([IMPORT_CONFIG.ASKED_STRATEGY_DEFAULT]);

  const { t } = useTranslation()

  const handleChangeImportStrategy = (strategy: string[]) => {
    if (strategy.length === 0) return

    setStrategy(strategy as ImportStrategy[])
  }

  const { parsed, duplicated } = presetsToImport

  const descriptionText = t("presetsManager.dialogs.importPreset.description", {
    count: duplicated.length,
    total: parsed.length
  })

  const strategyOptions = Object.values(ImportStrategy)
    .filter(strategy => strategy !== ImportStrategy.ALWAYS_ASK)

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
            {descriptionText}
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
                  {t('globals.fields', { count: preset.fields.length })}
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
            value={strategy}
            variant="outline"
            onValueChange={handleChangeImportStrategy}
          >
            <ButtonGroup>
              {strategyOptions.map((value) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                >
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
          <Button onClick={() => onImport(presetsToImport.parsed, strategy[0])}>
            {t("presetsManager.dialogs.importPreset.confirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
