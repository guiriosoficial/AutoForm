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
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { cn, preventDefaultEscape, isPopulatedJson5 } from "@/lib/utils";
import { type CatalogMethod, isValidCustomMethod } from "@/lib/catalog";
import { EditorTabs, IconSize } from "@/configs";
import type { PopoverRoot } from "@base-ui/react";

interface FieldSetupPopoverProps {
  method: CatalogMethod | null;
  options: string | undefined;
  onOptionsChange: (nextOptions: string) => void;
}

export interface FieldSetupPopoverRef {
  startEditing: (tab: EditorTabs) => void;
}

function FieldSetupPopoverComponent(
  {
    method,
    options,
    onOptionsChange,
  }: FieldSetupPopoverProps,
  ref: ForwardedRef<FieldSetupPopoverRef>
) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTabs>(EditorTabs.OPTIONS);
  const [isDeleteMethodAlertOpen, setIsDeleteMethodAlertOpen] = useState(false);

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [javascriptError, setJavascriptError] = useState<string | null>(null);

  const { t } = useTranslation();
  const {
    updateCustomMethod,
    removeCustomMethod,
    getMethodUsageCount,
  } = useCatalog()
  const { autoFormat } = useAppSettings()

  const jsonEditorRef = useRef<JsonEditorRef>(null);
  const javascriptEditorRef = useRef<JavascriptEditorRef>(null);

  const error = activeTab === EditorTabs.OPTIONS ? jsonError : javascriptError;
  const customMethodUsageCount = getMethodUsageCount(method?.key)

  const isCustomMethod = isValidCustomMethod(method)
  const hasOptions = isPopulatedJson5(options);

  const handleFormatActiveEditor = () => {
    const activeEditor = activeTab === EditorTabs.OPTIONS
      ? jsonEditorRef
      : javascriptEditorRef;

    activeEditor.current?.format();
  };

  const handleDeleteCustomMethod = (methodKey: string) => {
    removeCustomMethod(methodKey);

    setIsDeleteMethodAlertOpen(false);
    setOpen(false);
  };

  const handleChangeCustomMethod = <K extends keyof CatalogMethod>(
    propertyKey: K,
    nextValue: CatalogMethod[K],
  ) => {
    if (!isCustomMethod || !nextValue) return;

    updateCustomMethod(
      method.key,
      { [propertyKey]: nextValue }
    )
  };

  const handlePopoverOpenChange = (isOpening: boolean, event: PopoverRoot.ChangeEventDetails) => {
    const isClosingByClickOnAlert =
      !isOpening &&
      isDeleteMethodAlertOpen &&
      event?.reason === "outside-press";

    if (isClosingByClickOnAlert) return;

    if (autoFormat) {
      jsonEditorRef.current?.format();
      javascriptEditorRef.current?.format();
    }

    setOpen(isOpening);
  };

  const startEditing = useCallback((targetTab: EditorTabs) => {
    setActiveTab(targetTab);
    setOpen(true);
  }, [])

  useImperativeHandle(ref, () => ({
    startEditing,
  }), [startEditing])

  const triggerButtonClasses = cn(
    "relative",
    hasOptions && "bg-primary/5 hover:bg-primary/15! aria-expanded:bg-primary/15 text-primary hover:text-primary aria-expanded:text-primary",
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
  const deleteAlertDescription = [
    !!customMethodUsageCount?.fieldUsageCount && t("fieldsManager.alerts.deleteCustomMethod.usesCounter", customMethodUsageCount),
    t("fieldsManager.alerts.deleteCustomMethod.description", { name: method?.name }),
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
              <Settings2 size={IconSize.MD} />
              {hasOptions && <span className={triggerBadgeClasses} />}
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
                  onClick={handleFormatActiveEditor}
                >
                  {t("fieldsManager.popovers.fieldSettings.formatButton")}
                </Button>
                {isCustomMethod && (
                  <Button
                    className="hover:text-destructive hover:bg-destructive/10"
                    variant="secondary"
                    size="icon-sm"
                    onClick={() => setIsDeleteMethodAlertOpen(true)}
                  >
                    <Trash />
                  </Button>
                )}
              </div>
            </PopoverHeader>

            <TabsContent value={EditorTabs.OPTIONS}>
              <JsonEditor
                ref={jsonEditorRef}
                value={options}
                hasOptions={hasOptions}
                className={editorClasses}
                onChange={onOptionsChange}
                onErrorChange={setJsonError}
              />
            </TabsContent>

            {isCustomMethod && (
              <TabsContent value={EditorTabs.METHOD}>
                <JavascriptEditor
                  ref={javascriptEditorRef}
                  value={method}
                  className={editorClasses}
                  onChange={handleChangeCustomMethod}
                  onErrorChange={setJavascriptError}
                />
              </TabsContent>
            )}
          </Tabs>

          <PopoverDescription className={descriptionClasses}>
            {descriptionText}

            {method && (
              <a
                href={method.docs}
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

      {(isDeleteMethodAlertOpen && isCustomMethod) && (
        <AlertDialog
          destructive
          open={isDeleteMethodAlertOpen}
          description={deleteAlertDescription}
          onConfirm={() => handleDeleteCustomMethod(method.key)}
          onCancel={() => setIsDeleteMethodAlertOpen(false)}
        />
      )}
    </>
  );
}

export const FieldSetupPopover = forwardRef(FieldSetupPopoverComponent)

FieldSetupPopover.displayName = "FieldSetupPopover";
