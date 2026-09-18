import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Zap } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InlineInput, type InlineInputRef } from "@/components/shared/InlineInput";
import { Footer } from "@/components/layouts/Footer";
import { FieldsManager } from "@/components/FieldsManager";
import { PresetsManager } from "@/components/PresetsManager";
import { CatalogProvider } from "@/providers/CatalogProvider";
import { useForm } from "@/hooks/use-form";
import { usePresets } from "@/hooks/use-presets";
import { useCatalogData } from "@/hooks/use-catalog-data";

export function HomeView() {
  const { t } = useTranslation();

  const presetNameEditorRef = useRef<InlineInputRef>(null);

  const {
    presets,
    currentPreset,
    setCurrentPreset,
    updateCurrentPresetName,
    updateCurrentPresetFields,
    detachGeneratorFromPresets,
    isDuplicatedPresetName,
    createPreset,
    deletePreset,
    exportPresets,
    importPresets,
    parsePresets,
  } = usePresets({
    presetNameEditorRef,
  });

  const catalogData = useCatalogData({
    presets,
    detachGeneratorFromPresets
  });

  const {
    catalogMethodsByKey,
    customMethods,
    setCustomMethods,
  } = catalogData

  const fields = currentPreset?.fields ?? [];

  const {
    addField,
    removeField,
    updateField,
    generateValues,
    regenerateValue,
    copyValue,
    copyFormAsJSON,
    generatedValues,
  } = useForm({
    fields,
    updateFields: updateCurrentPresetFields,
    presetId: currentPreset?.id ?? "",
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {t("presetsManager.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-row">
          <PresetsManager
            presets={presets}
            selectedPreset={currentPreset}
            onSelectPreset={setCurrentPreset}
            onCreatePreset={createPreset}
            onDeletePreset={deletePreset}
            onExportPresets={exportPresets}
            onImportPresets={importPresets}
            onLoadFile={parsePresets}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-x-11">
          <CardTitle>
            <InlineInput
              ref={presetNameEditorRef}
              value={currentPreset?.name}
              placeholder={t("fieldsManager.form.presetNameInput.placeholder")}
              error={(draft: string) => isDuplicatedPresetName(draft, currentPreset?.id)}
              onSave={updateCurrentPresetName}
            />
          </CardTitle>
          <CardAction>
            <CardDescription>
              {t("fieldsManager.description", { count: fields.length })}
            </CardDescription>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          <CatalogProvider catalogData={catalogData}>
            <FieldsManager
              fields={fields}
              values={generatedValues}
              onUpdateField={updateField}
              onAddField={addField}
              onRemoveField={removeField}
              onRegenerateValue={regenerateValue}
              onCopyValue={copyValue}
            />
          </CatalogProvider>
        </CardContent>
      </Card>

      <Footer
        primaryButonText={t("footer.buttons.generateData")}
        primaryButtonIcon={Zap}
        onPrimaryButtonClick={generateValues}
        secondaryButtonText={t("footer.buttons.copyAsJson")}
        secondaryButtonIcon={Copy}
        onSecondaryButtonClick={copyFormAsJSON}
        hideSecondaryButton={Object.keys(generatedValues).length <= 0}
      />
    </>
  );
}
