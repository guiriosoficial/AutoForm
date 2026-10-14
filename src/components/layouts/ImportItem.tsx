import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IconSize, ImportConflictType, ImportStrategy } from "@/configs";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { type PartialBy, cn } from "@/lib/utils";
import type { Preset } from "@/lib/presets";
import type { CatalogMethod } from "@/lib/catalog";
import type { ImportConflict } from "@/hooks/use-import-export";

interface ImportItemCustomMethod {
  item: MappedItemsToImport<CatalogMethod>
  type: "customMethod"
}

interface ImportItemPreset {
  item: MappedItemsToImport<Preset>
  type: "preset"
}

type ImportItemProps = (
  | ImportItemCustomMethod
  | ImportItemPreset
  ) & {
  importStrategy: ImportStrategy
}

type MappedItemsToImport<T> = PartialBy<ImportConflict<T>, "conflictType" | "reference">;

export function ImportItem({
  item,
  type,
  importStrategy
}: ImportItemProps) {
  const { t } = useTranslation();

  const warningClasses = "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-600"

  const conflictBadgeClass = cn(item.conflictType === ImportConflictType.NAME && warningClasses, "ml-1")

  const showIncomingItem =
    item.conflictType &&
    item.reference &&
    importStrategy !== ImportStrategy.REPLACE_ALL;

  const getConflictTitleClass = (isExisting = false) =>
    cn(
      (item.conflictType === ImportConflictType.ID && isExisting === (importStrategy !== ImportStrategy.APPEND)) && "text-destructive",
      (!isExisting && item.conflictType === ImportConflictType.NAME) && "text-amber-600",
      importStrategy === ImportStrategy.REPLACE_ALL && "text-popover-foreground",
      isExisting && "w-auto text-right",
      "inline-table text-balance"
    );

  const getConflictTitle = (isExisting = false) => {
    const isNameConflict = item.conflictType === ImportConflictType.NAME
    const useTarget = isNameConflict === isExisting

    return useTarget ? item.target.name : item.reference?.name
  }

  const getReleaseLabel = (isExisting = false) =>
    ((item.reference?.updatedAt ?? 0) > (item.target?.updatedAt ?? 0)) === isExisting
      ? t("presetsManager.dialogs.importPreset.captions.oldest")
      : t("presetsManager.dialogs.importPreset.captions.newest")

  const showReleaseLabel =
    item.reference &&
    item.conflictType === ImportConflictType.ID &&
    importStrategy !== ImportStrategy.REPLACE_ALL

  const showIncomingCaption =
    item.conflictType === ImportConflictType.ID

  const arrowIcon =
    importStrategy === ImportStrategy.APPEND ||
    item.conflictType === ImportConflictType.NAME
      ? ArrowRight
      : ArrowLeft

  const incomingItemCaption =
    type === "preset"
      ? t("globals.fields", { count: item.target.fields.length })
      : item.target.code

  const currentItemCaption =
    type === "preset"
      ? t("globals.fields", { count: item.reference?.fields.length })
      : item.reference?.code

  return (
    <Item
      className="p-0 list-item marker:text-muted-foreground"
      size="xs"
    >
      <ItemContent className="grid grid-cols-[1fr_auto_1fr] gap-2">
        <div>
          <ItemTitle className={getConflictTitleClass()}>
            {getConflictTitle()}
            {item.conflictType && (
              <Badge
                variant="destructive"
                className={conflictBadgeClass}
              >
                {t(`configs.import.conflicts.${item.conflictType}`)}
              </Badge>
            )}
          </ItemTitle>
          <ItemDescription>
            {incomingItemCaption}
            {showReleaseLabel && (
              <div className="font-semibold">
                {`${getReleaseLabel()} • ${t("presetsManager.dialogs.importPreset.captions.incoming")}`}
              </div>
            )}
          </ItemDescription>
        </div>
        {showIncomingItem && (
          <>
            <DynamicIcon
              icon={arrowIcon}
              size={IconSize.MD}
              className="mt-px"
            />
            <div className="text-right *:text-right">
              <ItemTitle className={getConflictTitleClass(true)}>
                {getConflictTitle(true)}
              </ItemTitle>
              <ItemDescription>
                {showIncomingCaption ? (
                  <>
                    {currentItemCaption}
                    <div className="font-semibold">
                      {`${t("presetsManager.dialogs.importPreset.captions.current")} • ${getReleaseLabel(true)}`}
                    </div>
                  </>
                ) : (
                  <div className="font-semibold">
                    {t("presetsManager.dialogs.importPreset.captions.automaticRename")}
                  </div>
                )}
              </ItemDescription>
            </div>
          </>
        )}
      </ItemContent>
    </Item>
  )
}