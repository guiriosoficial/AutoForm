import { useCallback, useEffect } from "react";
import { Zap, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Header } from "@/components/Header";
import { PresetManager } from "@/components/PresetManager";
import { FormManager } from "@/components/FormManager";
import { usePresets } from "@/hooks/use-presets";
import { useForm } from "@/hooks/use-form";
import type { FieldConfig } from "@/lib/fieldsConfig";
import {InlineEditableInput} from "@/components/InlineEditableInput.tsx";

export function Index(){
  const {
    presets,
    currentPreset,
    setCurrentPreset,
    createPreset,
    updatePreset,
    deletePreset,
    exportPresets,
    importPresets
  } = usePresets();

  const fields = currentPreset?.fields ?? [];

  const setFields = useCallback((updater: (prev: FieldConfig[]) => FieldConfig[]) => {
      if (!currentPreset) return;

      updatePreset(
        currentPreset.id,
        { fields: updater(fields) }
      );
    },
    [fields, currentPreset, updatePreset]
  );

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
    setFields
  });

  const handleChangePresetName = (newName: string) => {
    if (!currentPreset) return;

    updatePreset(
      currentPreset.id,
      { name: newName }
    )
  }

  useEffect(() => {
    if (currentPreset) return;

    if (presets?.length > 0) {
      setCurrentPreset(presets[0]);
      return;
    }

    createPreset()
  }, [presets, currentPreset]);

  return (
    <div className="min-h-screen w-125 bg-background flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-xl space-y-4">
        <Header />

        {/* Presets */}
        <Card>
          <CardHeader>
            <CardTitle>Presets</CardTitle>
          </CardHeader>
          <CardContent>
            <PresetManager
              presets={presets}
              selectedPreset={currentPreset}
              onSelectPreset={setCurrentPreset}
              onCreatePreset={createPreset}
              onDeletePreset={deletePreset}
              onExport={exportPresets}
              onImport={importPresets}
            />
          </CardContent>
        </Card>

        {/* Fields */}
        <Card>
          <CardHeader>
            <CardTitle>
              <InlineEditableInput
                value={currentPreset?.name}
                onSave={handleChangePresetName}
                placeholder="Campos"
              />
            </CardTitle>
            <CardAction>
              <CardDescription>
                {fields.length} campo(s)
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
        <div className="flex gap-2">
          <Button
            onClick={generateValues}
            className="flex-1"
          >
            <Zap size={16} />
            Gerar Dados
          </Button>

          {Object.keys(generatedValues).length > 0 && (
            <Button
              onClick={copyFormAsJSON}
              variant="outline"
            >
              <Copy />
              Copiar JSON
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
