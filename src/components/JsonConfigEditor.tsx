import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { json5 } from "codemirror-json5"
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
  EDITOR_KEYMAP,
  EDITOR_LINT,
  EDITOR_CONFIG,
  EDITOR_THEME,
} from "@/configs";
import {
  cn,
  debounce,
  preventDefaultEscape
} from "@/lib/utils";
import JSON5 from "@/lib/json5";

interface JsonConfigEditorProps {
  value: string | undefined;
  docUrl?: string;
  onChange: (value: string) => void;
}

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

    const formattedValue = JSON5.stringify(
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
    if (!hasConfig) {
      setError("");
      return;
    }

    try {
      const parsedValue = JSON5.parse(value);
      setError("");
      return parsedValue;
    } catch (err: Error | unknown) {
      if (!(err instanceof Error)) return
      setError(err.message);
    }
  };

  const debouncedParseConfig = debounce((value: string) => {
    parseConfig(value);
  }, EDITOR_CONFIG.LINT_DELAY_MS)


  const handleConfigChange = (value: string) => {
    onChange(value);

    debouncedParseConfig(value)
  };

  useEffect(() => {
    if (!value) return;

    parseConfig(value);

    return debouncedParseConfig.cancel();
  }, [])

  const trimmedValue = value?.trim();

  const hasConfig = !!trimmedValue &&
    !/^\{\s*}$/.test(trimmedValue) &&
    !/^(['"]) *\1$/.test(trimmedValue);

  const editorExtension = [
    json5(),
    EDITOR_LINT(hasConfig),
    EDITOR_KEYMAP(formatConfig),
  ];

  const triggerButtonClasses = cn(
    "relative",
    hasConfig && "bg-primary/5 hover:bg-primary/15! aria-expanded:bg-primary/15 text-primary hover:text-primary aria-expanded:text-primary",
    error && "bg-destructive/5 hover:bg-destructive/15! aria-expanded:bg-destructive/15 text-destructive hover:text-destructive aria-expanded:text-destructive"
  );
  const triggerBadgeClasses = cn(
    "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full",
    error ? "bg-destructive": "bg-primary"
  );
  const editorClasses = cn(
    "border-border border rounded-md *:outline-none! *:h-48 *:p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent",
    error && "border-destructive"
  )
  const descriptionClasses = cn(
    "text-xs text-muted-foreground flex items-start justify-between gap-1",
    error && "text-destructive"
  )
  const descriptionText = error !== "" ? error : t("fieldsManager.popovers.fieldSettings.caption")

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
          theme={EDITOR_THEME}
          basicSetup={EDITOR_CONFIG.BASIC_SETUP}
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