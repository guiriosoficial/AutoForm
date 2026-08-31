import { useTranslation } from "react-i18next";
import { json5 } from "codemirror-json5"
import {
  useEffect,
  useMemo,
  useState,
  useRef, useCallback
} from "react";
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
  EDITOR_BASIC_SETUP
} from "@/configs";
import {
  createEditorTheme,
  createEditorKeymap,
  createEditorLinter
} from "@/lib/editor"
import { cn, getErrorMessage } from "@/lib/utils";
import { preventDefaultEscape } from "@/lib/events"
import { debounce } from "@/lib/async"
import {
  parseJson5,
  stringifyJson5,
  isPopulatedJson5
} from "@/lib/json5";

interface FieldOptionsPopoverProps {
  value: string | undefined;
  docUrl?: string;
  onChange: (value: string) => void;
}

const editorTheme = createEditorTheme()

export function FieldOptionsPopover({
  value,
  docUrl,
  onChange
}: FieldOptionsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();

  const hasConfig = isPopulatedJson5(value);

  const parseConfig = useCallback((val: string) => {
    if (!isPopulatedJson5(val)) {
      setError("");
      return;
    }

    try {
      const parsedValue = parseJson5(val);
      setError("");
      return parsedValue;
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message);
    }
  }, []);

  const formatConfig = useCallback(async () => {
    if (!value) return;

    const parsedValue = await parseConfig(value);

    const formattedValue = stringifyJson5(parsedValue);

    onChange(formattedValue)
  }, [value, onChange, parseConfig]);

  const debouncedParseConfig = useRef(debounce(
    (text: string) => parseConfig(text),
    EDITOR_CONFIG.LINT_DELAY_MS)
  ).current;


  const handlePopoverOpenChange = async (isOpening: boolean) => {
    await formatConfig();

    setOpen(isOpening);
  };

  const handleConfigChange = (value: string) => {
    onChange(value);

    debouncedParseConfig(value)
  };

  useEffect(() => {
    if (value) parseConfig(value);

    return () => {
      debouncedParseConfig.cancel();
    }
  }, []);

  const editorExtension = useMemo(() => [
    json5(),
    createEditorLinter(hasConfig),
    createEditorKeymap({ onFormat: formatConfig })
  ], [hasConfig, formatConfig]);

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
  );
  const descriptionClasses = cn(
    "text-xs text-muted-foreground flex items-start justify-between gap-1",
    error && "text-destructive"
  );

  const descriptionText = error || t("fieldsManager.popovers.fieldSettings.caption");

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