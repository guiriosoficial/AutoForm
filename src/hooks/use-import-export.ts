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

export interface ExportPayload {
  presets: Preset[];
  customMethods: CatalogMethod[];
}

export type ImportPayload = ExportPayload;

export interface ParseImportDataResult {
  parsedData: ImportPayload;
  conflicts: {
    presets: Preset[];
    customMethods: CatalogMethod[];
  };
}

export function useImportExport({
  presets,
  setPresets,
  customMethods,
  setCustomMethods,
}: UseImportExportArgs) {
  const { t } = useTranslation();

  const exportData = useCallback(() => {
    const exportPayload = { presets, customMethods };
    const exportJson = JSON.stringify(exportPayload, null, EXPORT_CONFIG.INDENT_SPACES);
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
      const importPayload: ImportPayload = JSON.parse(jsonContent);

      const isImportedDataInvalid =
        !isValidPresetArray(importPayload.presets) ||
        !isValidCustomMethodArray(importPayload.customMethods);

      if (isImportedDataInvalid) {
        toast.error(t("presetsManager.messages.importPreset.invalid"));
        return;
      }

      const conflictingPresets = getDuplicatedItemsByKey(presets, importPayload.presets, "id");
      const conflictingCustomMethods = getDuplicatedItemsByKey(customMethods, importPayload.customMethods, "key");

      return {
        parsedData: importPayload,
        conflicts: {
          presets: conflictingPresets,
          customMethods: conflictingCustomMethods,
        },
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error, t("presetsManager.messages.importPreset.failed"));
      toast.error(errorMessage);
    }
  }, [presets, customMethods, t]);

  const importData = useCallback((
    importPayload: ImportPayload,
    importStrategy: ImportStrategy = ImportStrategy.OVERWRITE,
  ) => {
    const {
      presets: importedPresets,
      customMethods: importedCustomMethods
    } = importPayload

    if (importStrategy === ImportStrategy.REPLACE_ALL) {
      setPresets(importedPresets);
      setCustomMethods(importedCustomMethods);
      return;
    }

    const isAppendStrategy = importStrategy === ImportStrategy.APPEND;

    setPresets((prev) => {
      const presetsById = new Map(prev.map((preset) => [preset.id, preset]));

      for (const preset of importedPresets) {
        if (isAppendStrategy && presetsById.has(preset.id)) continue;

        presetsById.set(preset.id, preset);
      }

      return [...presetsById.values()];
    });

    setCustomMethods((prev) => {
      const customMethodsByKey = new Map(prev.map((customMethod) => [customMethod.key, customMethod]));

      for (const customMethod of importedCustomMethods) {
        if (isAppendStrategy && customMethodsByKey.has(customMethod.key)) continue;

        customMethodsByKey.set(customMethod.key, customMethod);
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
