import {
  type ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Settings2, Trash } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JavascriptEditor, type JavascriptEditorRef } from "@/components/layouts/JavascriptEditor";
import { JsonEditor, type JsonEditorRef } from "@/components/layouts/JsonEditor";
import { AlertDialog } from "@/components/shared/AlertDialog";
import { useCatalog } from "@/providers/CatalogProvider";
import { cn, preventDefaultEscape, isPopulatedJson5 } from "@/lib/utils";
import { EditorTabs } from "@/configs";
import type { PopoverRoot } from "@base-ui/react";
import type { CatalogMethod } from "@/lib/catalog";

interface FieldOptionsPopoverProps {
  methodKey: string;
  value: string | undefined;
  docUrl?: string;
  onChange: (value: string) => void;
}

export interface FieldOptionsPopoverRef {
  startEditing: (tab: EditorTabs) => void;
}

function FieldOptionsPopoverComponent(
  {
    methodKey,
    value,
    docUrl,
    onChange,
  }: FieldOptionsPopoverProps,
  ref: ForwardedRef<FieldOptionsPopoverRef>
) {
  const [open, setOpen] = useState(false);
  const [deleteMethodAlertOpen, setDeleteMethodAlertOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTabs>(EditorTabs.OPTIONS);

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [javascriptError, setJavascriptError] = useState<string | null>(null);

  const { t } = useTranslation();
  const {
    customMethodsByKey,
    updateCustomMethod,
    removeCustomMethod,
    getMethodUsageCount,
  } = useCatalog()

  const error = activeTab === EditorTabs.OPTIONS
    ? jsonError
    : javascriptError;

  const jsonEditorRef = useRef<JsonEditorRef>(null);
  const javascriptEditorRef = useRef<JavascriptEditorRef>(null);

  const currentCustomMethod = customMethodsByKey.get(methodKey) ?? null;
  const isCustomMethod = currentCustomMethod !== null;
  const hasConfig = isPopulatedJson5(value);

  const handleChangeCustomMethod = <K extends keyof CatalogMethod>(
    key: K,
    newValue: CatalogMethod[K],
  ) => {
    if (!isCustomMethod || !newValue) return;

    updateCustomMethod(
      currentCustomMethod?.key,
      { [key]: newValue }
    )
  };

  const handleConfirmDeleteMethod = (key: string) => {
    removeCustomMethod(key);

    setDeleteMethodAlertOpen(false);
    setOpen(false);
  };

  const handlePopoverOpenChange = (isOpening: boolean, event: PopoverRoot.ChangeEventDetails) => {
    const isClosingByClickOnAlert =
      !isOpening &&
      deleteMethodAlertOpen &&
      event?.reason === "outside-press";

    if (isClosingByClickOnAlert) return;

    jsonEditorRef.current?.format();
    javascriptEditorRef.current?.format();

    setOpen(isOpening);
  };

  const handleFormatClick = () => {
    if (activeTab === EditorTabs.OPTIONS) {
      jsonEditorRef.current?.format();
    } else {
      javascriptEditorRef.current?.format();
    }
  };

  const startEditing = useCallback((tab: EditorTabs) => {
    setActiveTab(tab);
    setOpen(true);
  }, [])

  useImperativeHandle(ref, () => ({
    startEditing,
  }), [startEditing])

  const triggerButtonClasses = cn(
    "relative",
    hasConfig && "bg-primary/5 hover:bg-primary/15! aria-expanded:bg-primary/15 text-primary hover:text-primary aria-expanded:text-primary",
    error && "bg-destructive/5 hover:bg-destructive/15! aria-expanded:bg-destructive/15 text-destructive hover:text-destructive aria-expanded:text-destructive"
  );
  const triggerBadgeClasses = cn(
    "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full",
    error ? "bg-destructive" : "bg-primary",
  );
  const editorClasses = cn(
    "border-border border rounded-md *:outline-none! *:h-48 *:p-2 overflow-y-auto scrollbar-thin",
    error && "border-destructive",
  );
  const descriptionClasses = cn(
    "text-xs text-muted-foreground flex items-start justify-between gap-1",
    error && "text-destructive",
  );

  const descriptionText = error || t("fieldsManager.popovers.fieldSettings.caption");

  const customMethodUsageCount = getMethodUsageCount(currentCustomMethod?.key)

  const deleteAlertDescription = [
    customMethodUsageCount?.fieldsUseCount
      ? t("fieldsManager.alerts.deleteCustomMethod.usesCounter", customMethodUsageCount)
      : null,
    t("fieldsManager.alerts.deleteCustomMethod.description", { name: currentCustomMethod?.label }),
  ]

  return (
    <>
      <Popover
        open={open}
        onOpenChange={handlePopoverOpenChange}
      >
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className={triggerButtonClasses}
            >
              <Settings2 size={16} />
              {hasConfig && <span className={triggerBadgeClasses} />}
            </Button>
          }
        />

        <PopoverContent
          side="left"
          onKeyDown={preventDefaultEscape}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <PopoverHeader className="flex-row items-center justify-between">
              <PopoverTitle>
                <TabsList variant="title">
                  <TabsTrigger
                    value={EditorTabs.OPTIONS}
                    disabled={!isCustomMethod}
                  >
                    {t("fieldsManager.popovers.fieldSettings.tabs.options")}
                  </TabsTrigger>
                  {isCustomMethod && (
                    <TabsTrigger value={EditorTabs.METHOD}>
                      {t("fieldsManager.popovers.fieldSettings.tabs.method")}
                    </TabsTrigger>
                  )}
                </TabsList>
              </PopoverTitle>
              <div className="flex gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleFormatClick}
                >
                  {t("fieldsManager.popovers.fieldSettings.formatButton")}
                </Button>
                {isCustomMethod && (
                  <Button
                    className="hover:text-destructive hover:bg-destructive/10"
                    variant="secondary"
                    size="icon-sm"
                    onClick={() => setDeleteMethodAlertOpen(true)}
                  >
                    <Trash />
                  </Button>
                )}
              </div>
            </PopoverHeader>

            <TabsContent value={EditorTabs.OPTIONS}>
              <JsonEditor
                ref={jsonEditorRef}
                value={value}
                hasConfig={hasConfig}
                className={editorClasses}
                onChange={onChange}
                onErrorChange={setJsonError}
              />
            </TabsContent>

            {isCustomMethod && (
              <TabsContent value={EditorTabs.METHOD}>
                <JavascriptEditor
                  ref={javascriptEditorRef}
                  value={currentCustomMethod}
                  className={editorClasses}
                  onChange={handleChangeCustomMethod}
                  onErrorChange={setJavascriptError}
                />
              </TabsContent>
            )}
          </Tabs>

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

      {(deleteMethodAlertOpen && isCustomMethod) && (
        <AlertDialog
          destructive
          open={deleteMethodAlertOpen}
          description={deleteAlertDescription}
          onConfirm={() => handleConfirmDeleteMethod(currentCustomMethod.key)}
          onCancel={() => setDeleteMethodAlertOpen(false)}
        />
      )}
    </>
  );
}

export const FieldOptionsPopover = forwardRef(FieldOptionsPopoverComponent)

FieldOptionsPopover.displayName = "FieldOptionsPopover";
