import { useTranslation } from "react-i18next";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { type Preset, isValidPresetArray } from "@/lib/presets";
import { type CatalogMethod, isValidCustomMethodArray } from "@/lib/catalog";
import { getDuplicatedItemsByKey, getErrorMessage } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { EXPORT_CONFIG, ImportStrategy } from "@/configs";

interface UseImportExportArgs {
  presets: Preset[];
  setPresets: Dispatch<SetStateAction<Preset[]>>;
  customMethods: CatalogMethod[];
  setCustomMethods: Dispatch<SetStateAction<CatalogMethod[]>>;
}

export interface ImportExportData {
  presets: Preset[];
  customMethods: CatalogMethod[];
}

export interface ParseImportDataResult {
  parsed: ImportExportData;
  duplicatedPresets: Preset[];
  duplicatedCustomMethods: CatalogMethod[];
}

export function useImportExport({
  presets,
  setPresets,
  customMethods,
  setCustomMethods,
}: UseImportExportArgs) {
  const { t } = useTranslation();

  const exportData = useCallback(() => {
    const exportJson = JSON.stringify({ presets, customMethods }, null, EXPORT_CONFIG.INDENT_SPACES);
    const downloadBlob = new Blob([exportJson], { type: EXPORT_CONFIG.FILE_TYPE });
    const downloadUrl = URL.createObjectURL(downloadBlob);

    try {
      const anchor = document.createElement("a");
      anchor.download = EXPORT_CONFIG.FILE_NAME;
      anchor.href = downloadUrl;
      anchor.click();
      anchor.remove();
    } catch {
      toast.error(t("presetsManager.messages.exportPreset.failed"));
    } finally {
      URL.revokeObjectURL(downloadUrl);
    }
  }, [presets, t]);

  const parseImportData = useCallback((jsonContent: string): ParseImportDataResult | undefined => {
    try {
      const importedData: ImportExportData = JSON.parse(jsonContent);

      const invalidImported =
        !isValidPresetArray(importedData.presets) ||
        !isValidCustomMethodArray(importedData.customMethods)

      if (invalidImported) {
        toast.error(t("presetsManager.messages.importPreset.invalid"));
        return;
      }

      const duplicatedPresets = getDuplicatedItemsByKey(presets, importedData.presets, "id");
      const duplicatedCustomMethods = getDuplicatedItemsByKey(customMethods, importedData.customMethods, "key");

      return {
        parsed: importedData,
        duplicatedPresets,
        duplicatedCustomMethods,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error, t("presetsManager.messages.importPreset.failed"));
      toast.error(errorMessage);
    }
  }, [presets, customMethods, t]);

  const importData = useCallback((
    imported: ImportExportData,
    importStrategy: ImportStrategy = ImportStrategy.OVERWRITE,
  ) => {
    if (importStrategy === ImportStrategy.REPLACE_ALL) {
      setPresets(imported.presets);
      setCustomMethods(imported.customMethods);
      return;
    }

    const isAppendStrategy = importStrategy === ImportStrategy.APPEND;

    setPresets((prev) => {
      const presetsById = new Map(prev.map((preset) => [preset.id, preset]));

      for (const preset of imported.presets) {
        if (isAppendStrategy && presetsById.has(preset.id)) continue;

        presetsById.set(preset.id, preset);
      }

      return [...presetsById.values()];
    });

    setCustomMethods((prev) => {
      const customMethodsByKey = new Map(prev.map((customMethod) => [customMethod.key, customMethod]));

      for (const method of imported.customMethods) {
        if (isAppendStrategy && customMethodsByKey.has(method.key)) continue;

        customMethodsByKey.set(method.key, method);
      }

      return [...customMethodsByKey.values()];
    })
  }, [setPresets, setCustomMethods]);


  return {
    exportData,
    importData,
    parseImportData,
  };
}
