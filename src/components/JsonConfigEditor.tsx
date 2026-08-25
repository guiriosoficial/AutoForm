import { useTranslation } from "react-i18next";
import { json5 } from "codemirror-json5"
import { useEffect, useMemo, useState, useRef } from "react";
import { Settings2, ExternalLink } from "lucide-react";
import ReactCodeMirror from "@uiw/react-codemirror";
import {
  Button,
  buttonVariants
} from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  EDITOR_CONFIG,
  EDITOR_BASIC_SETUP,
} from "@/configs";
import {
  createEditorTheme,
  createEditorKeymap,
  createEditorLinter,
} from "@/lib/editor"
import { cn } from "@/lib/utils";
import { preventDefaultEscape } from "@/lib/events"
import { debounce } from "@/lib/async"
import {
  parseJson5,
  stringifyJson5,
  isPopulatedJson5
} from "@/lib/json5";

interface JsonConfigEditorProps {
  value: string | undefined;
  docUrl?: string;
  onChange: (value: string) => void;
}

const editorTheme = createEditorTheme()

export function JsonConfigEditor({
  value,
  docUrl,
  onChange,
}: JsonConfigEditorProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();

  const formatConfig = async () => {
    if (!value) return;

    const parsedValue = await parseConfig(value);

    const formattedValue = stringifyJson5(
      parsedValue,
      { space: EDITOR_CONFIG.INDENT_SPACES }
    );

    onChange(formattedValue)
  };

  const handlePopoverOpenChange = async (isOpening: boolean) => {
    await formatConfig();
    setOpen(isOpening);
  };

  const parseConfig = (value: string) => {
    if (!isPopulatedJson5(value)) {
      setError("");
      return;
    }

    try {
      const parsedValue = parseJson5(value);
      setError("");
      return parsedValue;
    } catch (err: Error | unknown) {
      if (!(err instanceof Error)) return
      setError(err.message);
    }
  };

  const debouncedParseConfig = useRef(
    debounce((text: string) => parseConfig(text),
    EDITOR_CONFIG.LINT_DELAY_MS)
  ).current;

  const handleConfigChange = (value: string) => {
    onChange(value);

    debouncedParseConfig(value)
  };

  useEffect(() => {
    if (!value) return;

    parseConfig(value);

    return debouncedParseConfig.cancel();
  }, [])

  const hasConfig = isPopulatedJson5(value);

  const editorExtension = useMemo(() => [
    json5(),
    createEditorLinter(hasConfig),
    createEditorKeymap({ onFormat: formatConfig }),
  ], [hasConfig, formatConfig])

  const triggerButtonClasses = useMemo(() => cn(
    "relative",
    hasConfig && "bg-primary/5 hover:bg-primary/15! aria-expanded:bg-primary/15 text-primary hover:text-primary aria-expanded:text-primary",
    error && "bg-destructive/5 hover:bg-destructive/15! aria-expanded:bg-destructive/15 text-destructive hover:text-destructive aria-expanded:text-destructive"
  ), [hasConfig, error])
  const triggerBadgeClasses = useMemo(() => cn(
    "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full",
    error ? "bg-destructive": "bg-primary"
  ), [error])
  const editorClasses = useMemo(() => cn(
    "border-border border rounded-md *:outline-none! *:h-48 *:p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent",
    error && "border-destructive"
  ), [error])
  const descriptionClasses = useMemo(() => cn(
    "text-xs text-muted-foreground flex items-start justify-between gap-1",
    error && "text-destructive"
  ), [error])
  const descriptionText = useMemo(() =>  error || t("fieldsManager.popovers.fieldSettings.caption"), [error])

  return (
    <Popover
      open={open}
      onOpenChange={handlePopoverOpenChange}
    >
      <PopoverTrigger render={
        <Button
          variant="ghost"
          size="icon"
          className={triggerButtonClasses}
        >
          <Settings2 size={16} />
          {hasConfig && (
            <span className={triggerBadgeClasses} />
          )}
        </Button>
      } />

      <PopoverContent
        side="left"
        onKeyDown={preventDefaultEscape}
      >
        <PopoverHeader className="flex-row items-center justify-between">
          <PopoverTitle>
            {t("fieldsManager.popovers.fieldSettings.title")}
          </PopoverTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={formatConfig}
          >
            {t("fieldsManager.popovers.fieldSettings.formatButton")}
          </Button>
        </PopoverHeader>

        <ReactCodeMirror
          value={value}
          className={editorClasses}
          extensions={editorExtension}
          theme={editorTheme}
          basicSetup={EDITOR_BASIC_SETUP}
          onChange={handleConfigChange}
        />

        <PopoverDescription className={descriptionClasses}>
          {descriptionText}

          {docUrl && (
            <a
              href={docUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "link", size: "xs" })}
            >
              {t("fieldsManager.popovers.fieldSettings.docUrl")}
              <ExternalLink />
            </a>
          )}
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}