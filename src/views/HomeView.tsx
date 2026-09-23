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
import { useImportExport } from "@/hooks/use-import-export";
import { useCatalogData } from "@/hooks/use-catalog-data";

export function HomeView() {
  const { t } = useTranslation();

  const presetNameInputRef = useRef<InlineInputRef>(null);

  const {
    presets,
    currentPreset,
    setCurrentPreset,
    updateCurrentPresetName,
    updateCurrentPresetFields,
    removeGeneratorFromPresets,
    isPresetNameTaken,
    createPreset,
    deletePreset,
    setPresets,
  } = usePresets({
    presetNameInputRef,
  });

  const catalogData = useCatalogData({
    presets,
    removeGeneratorFromPresets,
  });

  const {
    catalogMethodsByKey,
    customMethods,
    setCustomMethods,
  } = catalogData;

  const {
    exportData,
    importData,
    parseImportData,
  } = useImportExport({
    presets,
    setPresets,
    customMethods,
    setCustomMethods,
  })

  const currentFields = currentPreset?.fields ?? [];
  const currentPresetId = currentPreset?.id ?? "";

  const {
    addField,
    removeField,
    updateField,
    generateValues,
    regenerateFieldValue,
    copyGeneratedValue,
    copyFieldsAsJSON,
    generatedValues,
  } = useForm({
    catalogMethodsByKey,
    presetId: currentPresetId,
    fields: currentFields,
    updateFields: updateCurrentPresetFields,
  });

  const getPresetNameErrorMessage = (name: string) =>
    isPresetNameTaken(name, currentPreset?.id)
      ? t("presetsManager.messages.changeName.duplicated")
      : ""

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
            onExportData={exportData}
            onImportData={importData}
            onParseImportData={parseImportData}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-x-11">
          <CardTitle>
            <InlineInput
              ref={presetNameInputRef}
              value={currentPreset?.name}
              placeholder={t("fieldsManager.form.presetNameInput.placeholder")}
              error={getPresetNameErrorMessage}
              onSave={updateCurrentPresetName}
            />
          </CardTitle>
          <CardAction>
            <CardDescription>
              {t("fieldsManager.description", { count: currentFields.length })}
            </CardDescription>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          <CatalogProvider catalogData={catalogData}>
            <FieldsManager
              generatedValues={generatedValues}
              fields={currentFields}
              onUpdateField={updateField}
              onAddField={addField}
              onRemoveField={removeField}
              onCopyGeneratedValue={copyGeneratedValue}
              onRegenerateFieldValue={regenerateFieldValue}
            />
          </CatalogProvider>
        </CardContent>
      </Card>

      <Footer
        primaryButtonText={t("footer.buttons.generateData")}
        primaryButtonIcon={Zap}
        onPrimaryButtonClick={generateValues}
        secondaryButtonText={t("footer.buttons.copyAsJson")}
        secondaryButtonIcon={Copy}
        onSecondaryButtonClick={copyFieldsAsJSON}
        hideSecondaryButton={Object.keys(generatedValues).length <= 0}
      />
    </>
  );
}
