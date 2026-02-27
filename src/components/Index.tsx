import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Zap, Copy, RotateCcw } from "lucide-react";
import { FieldRow } from "@/components/FieldRow";
import { PresetManager } from "@/components/PresetManager";
import { usePresets } from "@/hooks/use-presets";
import { useForm, createField } from "@/hooks/use-form";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { FieldConfig, Preset } from "@/lib/faker-options";

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
        getPresetById,
        persistNow
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
        copyValuesAsJSON
    } = useForm({
        fields,
        setFields
    });








    // Garante que sempre exista um preset selecionado (pra não ter tela "sem fonte de verdade")
    useEffect(() => {
        if (currentPresetId) return;

        if (presets.length > 0) {
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

    const handleAutoSaveOnBlur = useCallback(() => {
        persistNow();
    }, [persistNow]);

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
                        onCreateNewPreset={handleCreateNewPreset}
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
                      {fields.map(field => (
                        <div key={field.id} className="space-y-1">
                            <FieldRow
                              field={field}
                              onChange={updated => updateField(field.id, updated)}
                              onRemove={() => removeField(field.id)}
                              onBlur={handleAutoSaveOnBlur}
                            />

                            {generatedValues[field.id] && (
                              <div className="flex items-center gap-2 ml-0 pl-3 border-l-2 border-primary/30 animate-fade-in">
                                <span className="text-xs font-mono text-primary truncate flex-1">
                                  {generatedValues[field.id]}
                                </span>

                                  <button
                                    onClick={() => regenerateValue(field.id, field.fakerType)}
                                    className="shrink-0 text-muted-foreground hover:text-accent transition-colors"
                                    title="Regerar"
                                  >
                                      <RotateCcw size={12} />
                                  </button>

                                  <button
                                    onClick={() => copyValue(generatedValues[field.id])}
                                    className="shrink-0 text-muted-foreground hover:text-accent transition-colors"
                                    title="Copiar"
                                  >
                                      <Copy size={12} />
                                  </button>
                              </div>
                            )}
                        </div>
                      ))}

                      <Button onClick={addField} variant="ghost" className="border border-dashed w-full">
                          <Plus size={14} />
                          Adicionar campo
                      </Button>
                  </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                  <Button onClick={generateValues} className="flex-1">
                      <Zap size={16} />
                      Gerar Dados
                  </Button>

                  {Object.keys(generatedValues).length > 0 && (
                    <Button onClick={copyValuesAsJSON} variant="outline">
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