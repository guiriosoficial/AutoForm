import { useTranslation } from "react-i18next";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { type Preset, isValidPresetArray } from "@/lib/presets";
import { type CatalogMethod, isValidCustomMethodArray } from "@/lib/catalog";
import {
  type ConflictingItemPair,
  getErrorMessage,
  createNextSequencedName,
  findConflictingItemPairs,
} from "@/lib/utils";
import { toast } from "@/lib/toast";
import { ImportConflictType, ImportStrategy, EXPORT_CONFIG } from "@/configs";

interface UseImportExportArgs {
  presets: Preset[];
  setPresets: Dispatch<SetStateAction<Preset[]>>;
  customMethods: CatalogMethod[];
  setCustomMethods: Dispatch<SetStateAction<CatalogMethod[]>>;
}

export type ImportConflict<T> = (ConflictingItemPair<T> & { conflictType: ImportConflictType })

export interface ImportPayload {
  presets: Preset[];
  customMethods: CatalogMethod[];
}

export interface ParseImportDataResult {
  parsedData: ImportPayload;
  conflicts: {
    presets: ImportConflict<Preset>[];
    customMethods: ImportConflict<CatalogMethod>[];
  };
}

export type ExportPayload = ImportPayload

export function useImportExport({
  presets,
  setPresets,
  customMethods,
  setCustomMethods,
}: UseImportExportArgs) {
  const { t } = useTranslation();

  const exportData = useCallback(() => {
    const exportPayload: ExportPayload = { presets, customMethods };
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
    }

    URL.revokeObjectURL(downloadUrl);
  }, [presets, customMethods, t]);

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

      const conflictingPresetIds = findConflictingItemPairs(
        presets,
        importPayload.presets,
        "id",
        "updatedAt",
      );
      const conflictingCustomMethodKeys = findConflictingItemPairs(
        customMethods,
        importPayload.customMethods,
        "key",
        "updatedAt",
      );

      const conflictingPresetNames = findConflictingItemPairs(
        presets,
        importPayload.presets,
        "name",
        "id",
      )
      const conflictingCustomMethodNames = findConflictingItemPairs(
        customMethods,
        importPayload.customMethods,
        "name",
        "key",
      )

      for (const preset of conflictingPresetNames) {
        const newName = createNextSequencedName<Preset>(
          presets,
          "name",
          preset.target.name,
          {
            spaced: true,
            suffix: t("configs.preset.importSuffix"),
          },
        );

        Object.assign(preset.target, { name: newName });
      }
      for (const customMethod of conflictingCustomMethodNames) {
        const newName = createNextSequencedName<CatalogMethod>(
          customMethods,
          "name",
          customMethod.target.name,
          {
            spaced: true,
            suffix: t("configs.preset.importSuffix"),
          },
        );

        Object.assign(customMethod.target, { name: newName });
      }

      const allPresetsConflicts = [
        ...conflictingPresetIds.map((conflict) =>
          Object.assign(conflict, { conflictType: ImportConflictType.ID })
        ),
        ...conflictingPresetNames.map((conflict) =>
          Object.assign(conflict, { conflictType: ImportConflictType.NAME }))
        ,
      ];
      const allCustomMethodsConflicts = [
        ...conflictingCustomMethodKeys.map((conflict) =>
          Object.assign(conflict, { conflictType: ImportConflictType.ID })
        ),
        ...conflictingCustomMethodNames.map((conflict) =>
          Object.assign(conflict, { conflictType: ImportConflictType.NAME })
        ),
      ]

      return {
        parsedData: importPayload,
        conflicts: {
          presets: allPresetsConflicts,
          customMethods: allCustomMethodsConflicts,
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

      return [...presetsById.values()].toSorted(
        (firstPreset, secondPreset) => firstPreset.createdAt - secondPreset.createdAt
      );
    });

    setCustomMethods((prev) => {
      const customMethodsByKey = new Map(prev.map((customMethod) => [customMethod.key, customMethod]));

      for (const customMethod of importedCustomMethods) {
        if (isAppendStrategy && customMethodsByKey.has(customMethod.key)) continue;

        customMethodsByKey.set(customMethod.key, customMethod);
      }

      return [...customMethodsByKey.values()].toSorted(
        (firstPreset, secondPreset) => (firstPreset?.createdAt ?? 0) - (secondPreset?.createdAt ?? 0)
      );
    })
  }, [setPresets, setCustomMethods]);

  return {
    exportData,
    importData,
    parseImportData,
  };
}
