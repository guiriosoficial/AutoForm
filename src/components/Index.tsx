import { useRef, useState } from "react";
import { Plus, Zap, Copy, RotateCcw, Pencil, Check, X } from "lucide-react";
import { FieldRow } from "@/components/FieldRow";
import { PresetManager } from "@/components/PresetManager";
import { usePresets } from "@/hooks/use-presets";
import { useForm } from "@/hooks/use-form";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { Preset, FieldConfig } from "@/lib/faker-options";
import { Input } from "@/components/ui/input.tsx";

const createEmptyField = (): FieldConfig => ({
    id: crypto.randomUUID(),
    selector: "",
    fakerType: "",
});

const Index = () => {
    const { addField, removeField, updateField, generate, regenerate, copyValue, copyAllAsJSON, generatedValues, fields, setFields } = useForm();
    const { presets, addPreset, updatePreset, deletePreset, exportPresets, importPresets } = usePresets();

    const [currentPreset, setCurrentPreset] = useState<Preset | null>(null);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [draftTitle, setDraftTitle] = useState("");
    const titleInputRef = useRef<HTMLInputElement>(null);

    const beginTitleEdit = (name: string) => {
        setDraftTitle(name);
        setIsEditingTitle(true);
        requestAnimationFrame(() => titleInputRef.current?.focus());
        requestAnimationFrame(() => titleInputRef.current?.select());
    };

    const cancelTitleEdit = () => {
        setIsEditingTitle(false);
        setDraftTitle("");
    };

    const confirmTitleEdit = () => {
        if (!currentPreset) return;
        const next = draftTitle.trim();
        if (!next) return;
        updatePreset(currentPreset.id, { name: next });
        setIsEditingTitle(false);
    };

    const saveCurrentPresetFields = () => {
        if (!currentPreset) return;
        updatePreset(currentPreset.id, { fields });
    };

    const handleCreateNewPreset = () => {
        const emptyFields = [createEmptyField()];

        const newPreset: Preset = {
            id: crypto.randomUUID(),
            name: "Novo preset",
            fields: emptyFields,
            createdAt: Date.now(),
        };

        addPreset(newPreset);
        setCurrentPreset(newPreset);
        setFields(emptyFields);

        beginTitleEdit(newPreset.name);
    };


    const handleSetSelectedPreset = (preset: Preset | null) => {
        setCurrentPreset(preset ?? null)
        setFields(preset?.fields ?? [])
    }

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
                        onSelectPreset={handleSetSelectedPreset}
                        onCreateNewPreset={handleCreateNewPreset}
                        onExport={exportPresets}
                        onImport={importPresets}
                      />
                  </CardContent>
              </Card>

              {/* Fields */}
              <Card>
                  <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                          <CardTitle className="group flex items-center gap-2">
                              {!currentPreset ? (
                                <span>Campos</span>
                              ) : isEditingTitle ? (
                                <span className="flex items-center gap-2">
                                        <Input
                                          ref={titleInputRef}
                                          value={draftTitle}
                                          onChange={(e) => setDraftTitle(e.target.value)}
                                          className="h-8 w-[260px]"
                                          onKeyDown={(e) => {
                                              if (e.key === "Enter") confirmTitleEdit();
                                              if (e.key === "Escape") cancelTitleEdit();
                                          }}
                                        />
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          className="h-8 w-8"
                                          title="Confirmar"
                                          onClick={confirmTitleEdit}
                                        >
                                            <Check size={16} />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          className="h-8 w-8"
                                          title="Cancelar"
                                          onClick={cancelTitleEdit}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </span>
                              ) : (
                                <button
                                  type="button"
                                  className="flex items-center gap-2 text-left"
                                  onClick={() => beginTitleEdit(currentPreset.name)}
                                  title="Editar nome do preset"
                                >
                                    <span className="truncate max-w-[320px]">{currentPreset.name}</span>
                                    <Pencil
                                      size={14}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                                    />
                                </button>
                              )}
                          </CardTitle>

                          {currentPreset && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                              onClick={() => {deletePreset(currentPreset.id);}}
                              title="Excluir preset atual"
                            >
                                <X size={14} />
                            </Button>
                          )}
                      </div>

                      <CardDescription>{fields.length} campo(s)</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                      {fields.map(field => (
                        <div key={field.id} className="space-y-1">
                            <FieldRow
                              field={field}
                              onChange={updated => updateField(field.id, updated)}
                              onRemove={() => removeField(field.id)}
                              onBlur={saveCurrentPresetFields}
                            />

                            {generatedValues[field.id] && (
                              <div className="flex items-center gap-2 ml-0 pl-3 border-l-2 border-primary/30 animate-fade-in">
                                        <span className="text-xs font-mono text-primary truncate flex-1">
                                            {generatedValues[field.id]}
                                        </span>
                                  <button
                                    onClick={() => regenerate(field.id, field.fakerType)}
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

                      <Button
                        onClick={addField}
                        variant="ghost"
                        className="border border-dashed w-full"
                      >
                          <Plus size={14} />
                          Adicionar campo
                      </Button>
                  </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                  <Button onClick={generate} className="flex-1">
                      <Zap size={16} />
                      Gerar Dados
                  </Button>
                  {Object.keys(generatedValues).length > 0 && (
                    <Button onClick={copyAllAsJSON} variant="outline">
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