import { useTranslation } from "react-i18next";
import { useRef } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  InlineEditableInput,
  type InlineEditableInputRef
} from "@/components/InlineEditableInput";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PresetManager } from "@/components/PresetManager";
import { FormManager } from "@/components/FormManager";
import { usePresets } from "@/hooks/use-presets";
import { useForm } from "@/hooks/use-form";

export function Index(){
  const { t } = useTranslation();

  const presetNameEditorRef = useRef<InlineEditableInputRef>(null)

  const {
    presets,
    currentPreset,
    setCurrentPreset,
    updateCurrentPresetName,
    updateCurrentPresetFields,
    createPreset,
    deletePreset,
    exportPresets,
    importPresets,
    parsePresets
  } = usePresets({
    presetNameEditorRef
  });

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
    presetId: currentPreset?.id ?? ""
  });

  return (
    <div className="w-125 bg-background flex flex-col gap-4 p-4 pt-8">
      <Header />

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("presets")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PresetManager
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

      {/* Fields */}
      <Card>
        <CardHeader>
          <CardTitle>
            <InlineEditableInput
              ref={presetNameEditorRef}
              value={currentPreset?.name}
              placeholder={t("input_preset_name_placeholder")}
              onSave={updateCurrentPresetName}
            />
          </CardTitle>
          <CardAction>
            <CardDescription>
              {t("fields", { count: fields.length })}
            </CardDescription>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          <FormManager
            fields={fields}
            values={generatedValues}
            onUpdateField={updateField}
            onAddField={addField}
            onRemoveField={removeField}
            onCopyValue={copyValue}
            onRegenerateValue={regenerateValue}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <Footer
        showCopyButton={Object.keys(generatedValues).length > 0}
        generateValues={generateValues}
        copyFormAsJSON={copyFormAsJSON}
      />
    </div>
  );
}
