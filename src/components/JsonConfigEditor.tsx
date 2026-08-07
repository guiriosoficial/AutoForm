import { useCallback, useMemo, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface JsonConfigEditorProps {
  value: Record<string, unknown> | undefined;
  onChange: (value: string) => void;
}

// TODO:
// - Implementar auto Format
// - Implementar validaçao de json
// - Criar tema personalizado
export function JsonConfigEditor({
   value,
   onChange,
}: JsonConfigEditorProps) {
  const [open, setOpen] = useState(false);

  const hasConfig = value && value.trim() !== "" && value.trim() !== "{}";
  const error = ""

  const isValid = hasConfig;
  const isInvalid = hasConfig && false;

  const formatConfig = useCallback(() => {
    // TODO:
    // Quando adicionarmos o Prettier, a formatação acontecerá aqui.
  }, []);

  const extensions = useMemo(
    () => [
      javascript(),

      keymap.of([
        {
          key: "Mod-Shift-f",
          run: () => {
            formatConfig();
            return true;
          },
        },
      ]),
    ],
    [formatConfig]
  );

  const handlePopoverOpenChange = useCallback((isOpening: boolean) => {
    if (!isOpening) {
      formatConfig();
    }

    setOpen(isOpening);
  }, [formatConfig])

  return (
    <Popover
      open={open}
      onOpenChange={handlePopoverOpenChange}
    >
      <PopoverTrigger>
        <Button
          variant="ghost"
          size="icon"
          title="Settings"
          className={cn(
            "relative",
            isValid &&
              "bg-primary/15 text-primary hover:bg-primary/25",
            isInvalid &&
              "bg-destructive/15 text-destructive hover:bg-destructive/25"
          )}
        >
          <Settings2 size={16} />
          {hasConfig && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full",
                isValid ? "bg-primary" : "bg-destructive"
              )}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Configuração (JSON)
          </span>

          <Button
            variant="link"
            size="sm"
            onClick={formatConfig}
          >
            Formatar
          </Button>
        </div>

          <ReactCodeMirror
            value={value}
            onChange={onChange}
            extensions={extensions}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
              drawSelection: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: false,
              searchKeymap: false,
              lintKeymap: false,
            }}
            className="border-border border p-3 rounded-md"
          />

        <div className="flex items-center justify-between text-xs">
          {(hasConfig && error) ? (
            <span
              className="text-destructive"
              title={error}
            >
              {error}
            </span>
          ) : (
            <span className="text-muted-foreground">
              Configuração passadas ao Faker.js.
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}