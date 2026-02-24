import { useState, useRef, useCallback } from "react";
import { Settings2 } from "lucide-react";

interface JsonConfigEditorProps {
    value: string;
    onChange: (value: string) => void;
}

function highlightJson(text: string): string {
    if (!text.trim()) return "";
    // Escape HTML first
    const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    // Apply syntax coloring with CSS classes
    return escaped
        .replace(/"([^"\\]*(\\.[^"\\]*)*)"(\s*:)/g, '<span class="json-key">"$1"</span>$3')
        .replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="json-string">"$1"</span>')
        .replace(/\b(true|false|null)\b/g, '<span class="json-bool">$1</span>')
        .replace(/\b(-?\d+\.?\d*([eE][+-]?\d+)?)\b/g, '<span class="json-number">$1</span>');
}

function tryFormat(text: string): string {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        return text;
    }
}

export function JsonConfigEditor({ value, onChange }: JsonConfigEditorProps) {
    const [open, setOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value || "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasConfig = !!value?.trim() && value.trim() !== "{}";

    const handleToggle = () => {
        if (!open) {
            setLocalValue(value ? tryFormat(value) : "{\n  \n}");
        }
        setOpen(!open);
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setLocalValue(val);
        onChange(val);
    }, [onChange]);

    const handleBlur = () => {
        const formatted = tryFormat(localValue);
        setLocalValue(formatted);
        onChange(formatted);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const ta = textareaRef.current;
            if (!ta) return;
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const newVal = localValue.substring(0, start) + "  " + localValue.substring(end);
            setLocalValue(newVal);
            onChange(newVal);
            requestAnimationFrame(() => {
                ta.selectionStart = ta.selectionEnd = start + 2;
            });
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className={`shrink-0 h-9 w-9 flex items-center justify-center rounded-md transition-colors ${
                    hasConfig
                        ? "text-primary bg-primary/15 hover:bg-primary/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
                title="Configuração JSON"
            >
                <Settings2 size={15} />
                {hasConfig && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-10 z-50 w-72 rounded-lg border border-border bg-popover shadow-lg animate-fade-in">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Configuração (JSON)</span>
                        <button
                            onClick={() => {
                                const formatted = tryFormat(localValue);
                                setLocalValue(formatted);
                                onChange(formatted);
                            }}
                            className="text-[10px] text-primary hover:underline"
                        >
                            Formatar
                        </button>
                    </div>
                    <div className="relative p-2">
                        <div className="relative rounded-md border border-border bg-input overflow-hidden">
                            {/* Highlighted layer */}
                            <pre
                                className="absolute inset-0 p-3 text-xs font-mono whitespace-pre-wrap break-words pointer-events-none overflow-hidden leading-relaxed"
                                aria-hidden
                                dangerouslySetInnerHTML={{ __html: highlightJson(localValue) + "\n" }}
                            />
                            {/* Editable textarea */}
                            <textarea
                                ref={textareaRef}
                                value={localValue}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                spellCheck={false}
                                className="relative w-full min-h-[100px] p-3 text-xs font-mono bg-transparent text-transparent caret-foreground resize-y leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring rounded-md"
                                placeholder='{ "min": 1, "max": 100 }'
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                            Parâmetros passados ao Faker.js. Ex: {"{"} "min": 1, "max": 100 {"}"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}