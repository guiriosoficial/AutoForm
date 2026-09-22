import { useTranslation } from "react-i18next";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { type Preset, isValidPresetArray } from "@/lib/presets";
import { type CatalogMethod, isValidCustomMethodArray } from "@/lib/catalog";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { EXPORT_CONFIG, ImportStrategy } from "@/configs";

interface UseImportExportArgs {
  presets: Preset[];
  setPresets: Dispatch<SetStateAction<Preset[]>>;
  customMethods: CatalogMethod[];
  setCustomMethods: Dispatch<SetStateAction<CatalogMethod[]>>;
}

export interface ParseJsonResult {
  presets: Preset[];
  customMethods: CatalogMethod[];
}

export interface ParseImportExportResult {
  parsed: ParseJsonResult;
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
    const exportJsonData = JSON.stringify({ presets, customMethods }, null, EXPORT_CONFIG.INDENT_SPACES);
    const downloadBlob = new Blob([exportJsonData], { type: EXPORT_CONFIG.FILE_TYPE });
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

  const parseData = useCallback((json: string): ParseImportExportResult | undefined => {
    try {
      const imported: ParseJsonResult = JSON.parse(json);

      if (!isValidPresetArray(imported.presets)) {
        toast.error(t("presetsManager.messages.importPreset.invalid"));
        return;
      }

      if (!isValidCustomMethodArray(imported.customMethods)) {
        toast.error(t("presetsManager.messages.importPreset.invalid"));
        return;
      }

      const existingPresetIds = new Set(presets.map((preset) => preset.id));
      const duplicatedPresets = imported.presets.filter((preset) => existingPresetIds.has(preset.id));

      const existingCustomMethodsKey = new Set(customMethods.map((method) => method.key));
      const duplicatedCustomMethods = imported.customMethods.filter((method) => existingCustomMethodsKey.has(method.key));

      return {
        parsed: imported,
        duplicatedPresets,
        duplicatedCustomMethods,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error, t("presetsManager.messages.importPreset.failed"),);

      toast.error(errorMessage);
    }
  }, [presets, customMethods, t]);

  const importData = useCallback((
    imported: ParseJsonResult,
    strategy: ImportStrategy = ImportStrategy.OVERWRITE,
  ) => {
    if (strategy === ImportStrategy.REPLACE_ALL) {
      setPresets(imported.presets);
      setCustomMethods(imported.customMethods);
      return;
    }

    const isAppendStrategy = strategy === ImportStrategy.APPEND;

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
    parseData,
  };
}
