import { useTranslation } from "react-i18next";
import { json5 } from "codemirror-json5"
import {
  useEffect,
  useMemo,
  useState,
  useRef, useCallback
} from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Settings2, ExternalLink, Trash } from "lucide-react";
import { PopoverRoot } from "@base-ui/react";
import { AlertDialog } from "@/components/shared/AlertDialog";
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
  createEditorTheme,
  createEditorKeymap,
  createEditorLinter
} from "@/lib/editor"
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/errors";
import { preventDefaultEscape } from "@/lib/dom"
import { debounce } from "@/lib/async"
import {
  parseJson5,
  stringifyJson5,
  isPopulatedJson5
} from "@/lib/json5";
import { useCatalog } from "@/hooks/use-catalog";
import {
  EDITOR_CONFIG,
  EDITOR_BASIC_SETUP, CATALOG_CONFIG
} from "@/configs";

interface FieldOptionsPopoverProps {
  methodKey: string;
  value: string | undefined;
  docUrl?: string;
  onChange: (value: string) => void;
}

const editorTheme = createEditorTheme()

export function FieldOptionsPopover({
  methodKey,
  value,
  docUrl,
  onChange
}: FieldOptionsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

  const { removeCustomMethod } = useCatalog()

  const { t } = useTranslation();

  const methodToDeleteName = methodToDelete?.substring(methodToDelete?.indexOf(".") + 1)
  const isCustomMethod = methodKey.startsWith(CATALOG_CONFIG.CUSTOM_MODULE_NAME);
  const hasConfig = isPopulatedJson5(value);

  const handleStartDeleteMethod = (methodKey: string) => (
    setMethodToDelete(methodKey)
  )

  const handleConfirmDeleteMethod = (methodKey: string) => {
    removeCustomMethod(methodKey)

    setMethodToDelete(null)
  }

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


  const handlePopoverOpenChange = async (isOpening: boolean, event: PopoverRoot.ChangeEventDetails) => {
    if (!isOpening && event?.reason === "outside-press") return;

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
    <>
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
            <div className="flex gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={formatConfig}
              >
                {t("fieldsManager.popovers.fieldSettings.formatButton")}
              </Button>
              {isCustomMethod && (
                <Button
                  className="hover:text-destructive hover:bg-destructive/10"
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => handleStartDeleteMethod(methodKey)}
                >
                  <Trash />
                </Button>
              )}
            </div>
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

      {methodToDelete && (
        <AlertDialog
          destructive
          open={!!methodToDelete}
          description={t("fieldsManager.alerts.deleteCustomMethod.description", { methodToDeleteName })}
          onConfirm={() => handleConfirmDeleteMethod(methodToDelete)}
          onCancel={() => setMethodToDelete(null)}
        />
      )}
    </>
  );
}