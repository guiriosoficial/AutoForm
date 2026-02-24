import { useState } from "react";
import { Plus, Zap, Copy, RotateCcw } from "lucide-react";
import { FieldRow } from "@/components/FieldRow";
import { PresetManager } from "@/components/PresetManager";
import { usePresets } from "@/hooks/use-presets";
import { generateFakerValue } from "@/lib/faker-generator";
import type { FieldConfig } from "@/lib/faker-options";
import { toast } from "sonner";

const createField = (): FieldConfig => ({
    id: crypto.randomUUID(),
    selector: "",
    fakerType: "",
});

const Index = () => {
    const [fields, setFields] = useState<FieldConfig[]>([createField()]);
    const [generatedValues, setGeneratedValues] = useState<Record<string, string>>({});
    const { presets, addPreset, updatePreset, deletePreset, exportAll, importPresets } = usePresets();

    const addField = () => setFields(prev => [...prev, createField()]);

    const removeField = (id: string) => {
        setFields(prev => prev.length > 1 ? prev.filter(f => f.id !== id) : prev);
    };

    const updateField = (id: string, updated: FieldConfig) => {
        setFields(prev => prev.map(f => f.id === id ? updated : f));
    };

    const generate = () => {
        const values: Record<string, string> = {};
        fields.forEach(f => {
            if (f.fakerType) {
                values[f.id] = generateFakerValue(f.fakerType, f.config);
            }
        });
        setGeneratedValues(values);
        toast.success("Valores gerados com sucesso!");
    };

    const regenerate = (fieldId: string, fakerType: string) => {
        if (fakerType) {
            const field = fields.find(f => f.id === fieldId);
            setGeneratedValues(prev => ({ ...prev, [fieldId]: generateFakerValue(fakerType, field?.config) }));
        }
    };

    const copyValue = (value: string) => {
        navigator.clipboard.writeText(value);
        toast.success("Copiado!");
    };

    const copyAllAsJSON = () => {
        const data: Record<string, string> = {};
        fields.forEach(f => {
            if (generatedValues[f.id]) {
                data[f.selector || f.id] = generatedValues[f.id];
            }
        });
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        toast.success("JSON copiado!");
    };

    return (
        <div className="min-h-screen bg-background flex items-start justify-center p-4 pt-8">
            <div className="w-full max-w-xl space-y-4">
                {/* Header */}
                <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                        <Zap className="text-primary" size={24} />
                        <h1 className="text-xl font-bold text-foreground tracking-tight">Form Filler</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Preencha formulários automaticamente com dados aleatórios
                    </p>
                </div>

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
