import { useTranslation } from "react-i18next";
import { type RefObject, useCallback, useEffect, useMemo, useState } from "react";
import {
  type Preset,
  createEmptyPreset,
  getAdjacentPreset,
  isValidPresetArray,
} from "@/lib/presets";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { createNextSequencedName } from "@/lib/string";
import { getErrorMessage } from "@/lib/errors";
import { isFunction } from "@/lib/guards";
import { toast } from "@/lib/toast";
import { EXPORT_CONFIG, ImportStrategy, StorageKeys } from "@/configs";
import type { InlineInputRef } from "@/components/shared/InlineInput";
import type { FieldConfig } from "@/lib/fields";

interface UsePresetsArgs {
  presetNameEditorRef: RefObject<InlineInputRef | null>;
}

export interface ParsePresetsResult {
  parsed: Preset[];
  duplicated: Preset[];
}

export function usePresets({
  presetNameEditorRef,
}: UsePresetsArgs) {
  const { t } = useTranslation();

  const [currentPresetId, setCurrentPresetId] =
    useState<string>("");
  const [lasPresetId, setLastPresetId, , hydratedLastPresetId] =
    usePersistentState<string>(StorageKeys.LAST_PRESET_ID, "");
  const [presets, setPresets, , hydratedPresets] =
    usePersistentState<Preset[]>(StorageKeys.PRESETS, []);

  const presetsById = useMemo(() =>
    new Map(presets.map((preset) => [preset.id, preset])
  ), [presets]);

  const currentPreset = useMemo(
    () => presetsById.get(currentPresetId) ?? null,
    [presetsById, currentPresetId],
  );

  const setCurrentPreset = useCallback((preset: Preset | null | undefined) => {
    if (!preset) return;

    setCurrentPresetId(preset.id);
    setLastPresetId(preset.id);
  }, [setCurrentPresetId, setLastPresetId]);

  const createPreset = useCallback(() => {
    const defaultName = t("configs.preset.defaultName");
    const nextPresetNumber = createNextSequencedName<Preset>(
      presets,
      "name",
      defaultName,
      { spaced: true },
    );
    const emptyPreset = createEmptyPreset(nextPresetNumber);

    setPresets((prev) => [...prev, emptyPreset]);
    setCurrentPreset(emptyPreset);

    if (presets.length + 1 <= 1) return;

    requestAnimationFrame(() => {
      presetNameEditorRef.current?.startEditing();
    });
  }, [presets, presetNameEditorRef, t, setPresets, setCurrentPreset]);

  const deletePreset = useCallback((presetId: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== presetId));

    const isCurrent = presetId === currentPresetId;

    if (isCurrent) {
      const presetToSet = getAdjacentPreset(presets, presetId);
      setCurrentPreset(presetToSet);
    }
  }, [presets, currentPresetId, setPresets, setCurrentPreset]);

  const updatePreset = useCallback((
    presetId: string,
    updater: Partial<Preset> | ((preset: Preset) => Partial<Preset>),
  ) => {
    setPresets((prev) =>
      prev.map((preset) => {
        if (preset.id !== presetId) return preset;

        const updated = isFunction(updater)
          ? updater(preset)
          : updater;

        return {
          ...preset,
          ...updated,
        };
      }),
    );
  }, [setPresets]);

  const updateCurrentPreset = useCallback((updater: Partial<Preset> | ((preset: Preset) => Partial<Preset>)) => {
    if (!currentPreset) return;

    updatePreset(currentPreset.id, updater);
  }, [currentPreset, updatePreset]);

  const updateCurrentPresetFields = useCallback((updater: (fields: FieldConfig[]) => FieldConfig[]) => {
    updateCurrentPreset((preset) => ({
      fields: updater(preset.fields),
    }));
  }, [updateCurrentPreset]);

  const updateCurrentPresetName = useCallback((name: string) => {
    updateCurrentPreset(() => ({
      name,
    }));
  }, [updateCurrentPreset]);

  useEffect(() => {
    if (
      !hydratedLastPresetId ||
      !hydratedPresets ||
      currentPreset
    ) return;

    const lastPreset = presetsById.get(lasPresetId);

    if (lastPreset) {
      setCurrentPreset(lastPreset);
      return;
    }

    if (presets?.length > 0) {
      setCurrentPreset(presets[0]);
      return;
    }

    createPreset();
  }, [presets, currentPreset, presetsById, lasPresetId, hydratedPresets, hydratedLastPresetId, setCurrentPreset, createPreset]);

  const exportPresets = useCallback(() => {
    const data = JSON.stringify(presets, null, EXPORT_CONFIG.INDENT_SPACES);
    const blob = new Blob([data], { type: EXPORT_CONFIG.FILE_TYPE });
    const url = URL.createObjectURL(blob);

    try {
      const anchor = document.createElement("a");
      anchor.download = EXPORT_CONFIG.FILE_NAME;
      anchor.href = url;
      anchor.click();
      anchor.remove();
    } catch {
      toast.error(t("presetsManager.messages.exportPreset.failed"));
    } finally {
      URL.revokeObjectURL(url);
    }
  }, [presets, t]);

  const parsePresets = useCallback((json: string) => {
    try {
      const imported: Preset[] = JSON.parse(json);

      if (!isValidPresetArray(imported)) {
        throw new Error(t("presetsManager.messages.importPreset.invalid"));
      }

      const existingIds = new Set(presets.map((preset) => preset.id));

      const duplicated = imported.filter((preset) => existingIds.has(preset.id));

      return {
        parsed: imported,
        duplicated,
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error, t("presetsManager.messages.importPreset.failed"),);

      toast.error(errorMessage);
    }
  }, [presets, t]);

  const importPresets = useCallback((
    imported: Preset[],
    strategy: ImportStrategy = ImportStrategy.OVERWRITE,
  ) => {
    if (strategy === ImportStrategy.REPLACE_ALL) {
      setPresets(imported);
      return;
    }

    setPresets((prev) => {
      const isAppendStrategy = strategy === ImportStrategy.APPEND;
      const map = new Map(prev.map((preset) => [preset.id, preset]));

      for (const preset of imported) {
        if (isAppendStrategy && map.has(preset.id)) continue;

        map.set(preset.id, preset);
      }

      return [...map.values()];
    });
  }, [setPresets]);

  return {
    presets,
    currentPreset,
    setCurrentPreset,
    createPreset,
    updateCurrentPreset,
    updateCurrentPresetName,
    updateCurrentPresetFields,
    deletePreset,
    exportPresets,
    importPresets,
    parsePresets,
  };
}
