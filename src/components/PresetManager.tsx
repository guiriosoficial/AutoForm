import { useState, useRef } from "react";
import { Save, Trash2, Download, Upload, Pencil, Check, X } from "lucide-react";
import type { Preset, FieldConfig } from "@/lib/faker-options";

interface PresetManagerProps {
    presets: Preset[];
    currentFields: FieldConfig[];
    onLoad: (fields: FieldConfig[]) => void;
    onSave: (preset: Preset) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updated: Partial<Preset>) => void;
    onExport: () => void;
    onImport: (json: string) => boolean;
}

export function PresetManager({
                                  presets,
                                  currentFields,
                                  onLoad,
                                  onSave,
                                  onDelete,
                                  onUpdate,
                                  onExport,
                                  onImport,
                              }: PresetManagerProps) {
    const [selectedId, setSelectedId] = useState("");
    const [saveName, setSaveName] = useState("");
    const [showSave, setShowSave] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (!saveName.trim() || currentFields.length === 0) return;
        onSave({
            id: crypto.randomUUID(),
            name: saveName.trim(),
            fields: currentFields,
            createdAt: Date.now(),
        });
        setSaveName("");
        setShowSave(false);
    };

    const handleLoad = (id: string) => {
        const preset = presets.find(p => p.id === id);
        if (preset) {
            onLoad(preset.fields.map(f => ({ ...f, id: crypto.randomUUID() })));
            setSelectedId(id);
        }
    };

    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            onImport(reader.result as string);
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const startEdit = (preset: Preset) => {
        setEditingId(preset.id);
        setEditName(preset.name);
    };

    const confirmEdit = () => {
        if (editingId && editName.trim()) {
            onUpdate(editingId, { name: editName.trim() });
            setEditingId(null);
        }
    };

    return (
        <div className="space-y-3">
            {/* Preset selector + actions */}
            <div className="flex items-center gap-2">
                <select
                    value={selectedId}
                    onChange={e => handleLoad(e.target.value)}
                    className="flex-1 h-9 rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                >
                    <option value="">Carregar preset...</option>
                    {presets.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                <button
                    onClick={() => setShowSave(!showSave)}
                    className="shrink-0 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                    title="Salvar preset"
                >
                    <Save size={14} />
                    Salvar
                </button>

                <button
                    onClick={onExport}
                    className="shrink-0 h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Exportar todos"
                >
                    <Download size={14} />
                </button>

                <button
                    onClick={() => fileRef.current?.click()}
                    className="shrink-0 h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Importar presets"
                >
                    <Upload size={14} />
                </button>
                <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
            </div>

            {/* Save input */}
            {showSave && (
                <div className="flex items-center gap-2 animate-fade-in">
                    <input
                        type="text"
                        value={saveName}
                        onChange={e => setSaveName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSave()}
                        placeholder="Nome do preset..."
                        className="flex-1 h-9 rounded-md border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        autoFocus
                    />
                    <button
                        onClick={handleSave}
                        className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Confirmar
                    </button>
                </div>
            )}

            {/* Preset list */}
            {presets.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                    {presets.map(p => (
                        <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50 transition-colors group">
                            {editingId === p.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && confirmEdit()}
                                        className="flex-1 h-7 rounded border border-border bg-input px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                        autoFocus
                                    />
                                    <button onClick={confirmEdit} className="text-primary hover:text-primary/80"><Check size={14} /></button>
                                    <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                                </>
                            ) : (
                                <>
                  <span
                      className="flex-1 text-sm text-secondary-foreground truncate cursor-pointer hover:text-foreground"
                      onClick={() => handleLoad(p.id)}
                  >
                    {p.name}
                  </span>
                                    <span className="text-xs text-muted-foreground">{p.fields.length} campos</span>
                                    <button
                                        onClick={() => startEdit(p)}
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-accent transition-all"
                                        title="Renomear"
                                    >
                                        <Pencil size={13} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            onUpdate(p.id, { fields: currentFields });
                                        }}
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
                                        title="Atualizar com campos atuais"
                                    >
                                        <Save size={13} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(p.id)}
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                                        title="Excluir"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
