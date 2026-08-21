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
  FieldContent,
  // FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group"
import { ImportStrategy } from "@/configs";
import { preventDefaultEscape } from "@/lib/utils";
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
  const [strategy, setStrategy] = useState<ImportStrategy>(ImportStrategy.MERGE);

  const { t } = useTranslation()

  const { parsed, duplicated } = presetsToImport

  const descriptionText = t("presetsManager.dialogs.importPreset.description", {
    count: duplicated.length,
    total: parsed.length
  })

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

        <ul className="space-y-2 list-disc marker:text-muted-foreground ml-6">
          {duplicated.map((preset) => (
            <li>
              <span className="text-destructive font-semibold">
                {preset.name}
              </span>
                {" "}
                <span className="text-muted-foreground text-xs">
                {preset.fields.length} Campos
              </span>
            </li>
            // <Item className="p-0 text-destructive" size="xs">
            //   <ItemContent className="flex-row gap-4">
            //     <ItemTitle>{preset.name}</ItemTitle>
            //     <ItemDescription>{preset.fields.length} Campos</ItemDescription>
            //   </ItemContent>
            // </Item>
          ))}
        </ul>

        <RadioGroup
          value={strategy}
          onValueChange={setStrategy}
          className=""
        >
          <FieldLabel htmlFor="plus-plan">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Merge</FieldTitle>
                {/*<FieldDescription>*/}
                {/*  MAntera os presets ja existentes e adicionara os novos N±ao duplicados*/}
                {/*</FieldDescription>*/}
              </FieldContent>
              <RadioGroupItem
                value={ImportStrategy.MERGE}
                id="plus-plan"
              />
            </Field>
          </FieldLabel>
          {presetsToImport?.duplicated.length && (
            <FieldLabel htmlFor="pro-plan">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Replace</FieldTitle>
                  {/*<FieldDescription>Presets duplicados ser±ao substituidos pelos novos presets importados</FieldDescription>*/}
                </FieldContent>
                <RadioGroupItem
                  value={ImportStrategy.REPLACE}
                  id="pro-plan"
                />
              </Field>
            </FieldLabel>
          )}
          <FieldLabel htmlFor="enterprise-plan">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Substituir tudo</FieldTitle>
                {/*<FieldDescription>*/}
                {/*  Removera todos os preset atuais e importara os novos*/}
                {/*</FieldDescription>*/}
              </FieldContent>
              <RadioGroupItem
                value={ImportStrategy.REPLACE_ALL}
                id="enterprise-plan"
              />
            </Field>
          </FieldLabel>
        </RadioGroup>

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
