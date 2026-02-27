import { useState, useRef, useCallback } from "react";
import { Settings2 } from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";

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
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(hasConfig && "text-primary bg-primary/15 hover:bg-primary/25")}
                    title="Configuração JSON"
                >
                    <Settings2 size={16} />
                    {hasConfig && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Configuração (JSON)</span>
                        <Button
                          variant="link"
                          className="h-5 p-0"
                          size="sm"
                          onClick={() => {
                              const formatted = tryFormat(localValue);
                              setLocalValue(formatted);
                              onChange(formatted);
                          }}
                        >
                            Formatar
                        </Button>
                    </div>
                    <div className="mt-2">
                        <div className="rounded-md border border-border bg-input overflow-hidden">
                            <Textarea
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
            </PopoverContent>
        </Popover>
    );
}