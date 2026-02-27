import { Plus, Zap, Copy, RotateCcw } from "lucide-react";
import { FieldRow } from "@/components/FieldRow";
import { PresetManager } from "@/components/PresetManager";
import { usePresets } from "@/hooks/use-presets";
import { useForm } from "@/hooks/use-form";
import { Header } from "@/components/Header";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

const Index = () => {
    const { addField, removeField, updateField, generate, regenerate, copyValue, copyAllAsJSON, generatedValues, fields, setFields} = useForm()
    const { presets, addPreset, updatePreset, deletePreset, exportAll, importPresets } = usePresets();

    return (
        <div className="min-h-screen w-[500px] bg-background flex items-start justify-center p-4 pt-8">
            <div className="w-full max-w-xl space-y-4">
                <Header />

                {/* Presets */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Presets
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PresetManager
                            presets={presets}
                            currentFields={fields}
                            onLoad={setFields}
                            onSave={addPreset}
                            onDelete={deletePreset}
                            onUpdate={updatePreset}
                            onExport={exportAll}
                            onImport={importPresets}
                        />
                    </CardContent>
                </Card>

                {/* Fields */}
                <Card>
                    <CardHeader>
                        <CardTitle>Campos</CardTitle>
                        <CardDescription>{fields.length} campo(s)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">

                            {fields.map(field => (
                              <div key={field.id} className="space-y-1">
                                  <FieldRow
                                    field={field}
                                    onChange={updated => updateField(field.id, updated)}
                                    onRemove={() => removeField(field.id)}
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

                          // className="w-full h-9 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-secondary/30 transition-all flex items-center justify-center gap-1.5"
                        >
                            <Plus size={14} />
                            Adicionar campo
                        </Button>
                    </CardContent>
                </Card>




                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        onClick={generate}
                        className="flex-1"
                    >
                        <Zap size={16} />
                        Gerar Dados
                    </Button>
                    {Object.keys(generatedValues).length > 0 && (
                        <Button
                            onClick={copyAllAsJSON}
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
};

export default Index;
