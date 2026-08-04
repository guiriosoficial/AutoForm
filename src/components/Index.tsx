import { useCallback, useEffect, useMemo, useState } from "react";
import { Zap, Copy } from "lucide-react";
import { PresetManager } from "@/components/PresetManager";
import { usePresets } from "@/hooks/use-presets";
import { useForm, createField } from "@/hooks/use-form";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import {FormManager} from "@/components/FormManager.tsx";
import {Preset} from "@/types/Presets.ts";
import {FieldConfig} from "@/types/FieldConfig.ts";

const createEmptyPreset = (): Preset => ({
  id: crypto.randomUUID(),
  name: "Novo preset",
  fields: [createField()],
  createdAt: Date.now(),
});

const Index = () => {
  const {
    presets,
    addPreset,
    updatePreset,
    deletePreset,
    exportPresets,
    importPresets,
    getPresetById
  } = usePresets();

  const [currentPresetId, setCurrentPresetId] = useState<string | null>(null);

  const currentPreset = useMemo(() => {
    if (!currentPresetId) return null;

    return getPresetById(currentPresetId);
  }, [currentPresetId, getPresetById]);

  const setCurrentPreset = useCallback((preset: Preset | null) => {
    if (!preset) return;

    setCurrentPresetId(preset.id);
  }, [])

  const fields = currentPreset?.fields ?? [];

  const setFields = useCallback((updater: (prev: FieldConfig[]) => FieldConfig[]) => {
      if (!currentPresetId) return;

      updatePreset(
        currentPresetId,
        { fields: updater(fields) }
      );
    },
    [currentPresetId, updatePreset, fields]
  );

  const {
    addField,
    removeField,
    updateField,
    generateValues,
    regenerateValue,
    generatedValues,
    copyValue,
    copyFormAsJSON
  } = useForm({
    fields,
    setFields
  });








  // Garante que sempre exista um preset selecionado (pra não ter tela "sem fonte de verdade")
  useEffect(() => {
    if (currentPresetId) return;

    if (presets?.length > 0) {
      setCurrentPresetId(presets[0]!.id);
      return;
    }

    const emptyPreset = createEmptyPreset();
    addPreset(emptyPreset);
    setCurrentPresetId(emptyPreset.id);
  }, [addPreset, presets, currentPresetId]);







  const handleCreateNewPreset = useCallback(() => {
    const emptyPreset = createEmptyPreset();
    addPreset(emptyPreset);
    setCurrentPresetId(emptyPreset.id);
    // TODO: Focus preset name input here
  }, [addPreset]);

  const handleDeletePreset = useCallback((preset: Preset) => {
    deletePreset(preset.id);
    if (preset.id === currentPresetId) setCurrentPresetId(null);
    // TODO: Select next or previous preset
  }, [deletePreset, currentPresetId]);

  return (
    <div className="min-h-screen w-[500px] bg-background flex items-start justify-center p-4 pt-8">
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
              onCreatePreset={handleCreateNewPreset}
              onDeletePreset={handleDeletePreset}
              onExport={exportPresets}
              onImport={importPresets}
            />
          </CardContent>
        </Card>

        {/* Fields */}
        <Card>
          <CardHeader>
            <CardTitle>{currentPreset?.name ?? "Campos"}</CardTitle>
            <CardDescription>{fields.length} campo(s)</CardDescription>
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
          <Button onClick={generateValues} className="flex-1">
            <Zap size={16} />
            Gerar Dados
          </Button>

          {Object.keys(generatedValues).length > 0 && (
            <Button onClick={copyFormAsJSON} variant="outline">
              <Copy />
              Copiar JSON
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;