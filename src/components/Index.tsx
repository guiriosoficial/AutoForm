import { Plus, Zap, Copy, RotateCcw } from "lucide-react";
import { FieldRow } from "@/components/FieldRow";
import { PresetManager } from "@/components/PresetManager";
import { usePresets } from "@/hooks/use-presets";
import { useForm } from "@/hooks/use-form";
import { Header } from "@/components/Header";

const Index = () => {
    const { addField, removeField, updateField, generate, regenerate, copyValue, copyAllAsJSON, generatedValues, fields, setFields} = useForm()
    const { presets, addPreset, updatePreset, deletePreset, exportAll, importPresets } = usePresets();

    return (
        <div className="min-h-screen bg-background flex items-start justify-center p-4 pt-8">
            <div className="w-full max-w-xl space-y-4">
                <Header />

                {/* Presets */}
                <div className="rounded-lg border border-border bg-card p-4">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Presets</h2>
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
                </div>

                {/* Fields */}
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campos</h2>
                        <span className="text-xs text-muted-foreground">{fields.length} campo(s)</span>
                    </div>

                    <div className="space-y-2">
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
                    </div>

                    <button
                        onClick={addField}
                        className="w-full h-9 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-secondary/30 transition-all flex items-center justify-center gap-1.5"
                    >
                        <Plus size={14} />
                        Adicionar campo
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={generate}
                        className="flex-1 h-10 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Zap size={16} />
                        Gerar Dados
                    </button>
                    {Object.keys(generatedValues).length > 0 && (
                        <button
                            onClick={copyAllAsJSON}
                            className="h-10 px-4 rounded-md border border-border text-sm text-secondary-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
                        >
                            <Copy size={14} />
                            Copiar JSON
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Index;
