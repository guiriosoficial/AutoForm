import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState, type RefObject } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import {
  EXPORT_CONFIG,
  StorageKeys
} from "@/configs";
import {
  createEmptyPreset,
  getNewPresetNumber,
  getAdjacentPreset,
  isValidPresetArray,
  type Preset
} from "@/lib/presets";
import { toast } from "@/lib/toast"
import { ImportStrategy } from "@/configs"
import type { FieldConfig } from "@/lib/fields";
import type { InlineInputRef } from "@/components/shared/InlineInput";

interface UsePresetsArgs {
  presetNameEditorRef: RefObject<InlineInputRef | null>;
}

export interface ParsePresetsResult {
  parsed: Preset[];
  duplicated: Preset[];
}

export function usePresets({
  presetNameEditorRef
}: UsePresetsArgs) {
  const { t } = useTranslation();

  const [currentPresetId, setCurrentPresetId] = useState<string>("");
  const [lasPresetId, setLastPresetId, , hydratedLastPresetId] = usePersistentState<string>(StorageKeys.LAST_PRESET_ID, "")
  const [presets, setPresets, , hydratedPresets] = usePersistentState<Preset[]>(StorageKeys.PRESETS, []);

  const presetsById = useMemo(() => {
    return Object.fromEntries(
      presets.map(p => [p.id, p])
    )
  }, [presets]);

  const currentPreset = useMemo(() => {
    return presetsById[currentPresetId] ?? null
  }, [presetsById, currentPresetId]);

  const setCurrentPreset = useCallback((preset: Preset | null) => {
    if (!preset) return;

    setCurrentPresetId(preset.id);
    setLastPresetId(preset.id);
  }, [setCurrentPresetId, setLastPresetId, presetsById]);

  const createPreset = useCallback(() => {
    const nextPresetNumber = getNewPresetNumber(presets) + 1;
    const emptyPreset = createEmptyPreset(nextPresetNumber);

    setPresets((prev) =>
      [...prev, emptyPreset]
    );
    setCurrentPreset(emptyPreset);

    presetNameEditorRef.current?.startEditing()
  }, [setPresets, presets, presetNameEditorRef]);

  const deletePreset = useCallback((presetId: string) => {
    setPresets((prev) =>
      prev.filter(p => p.id !== presetId)
    );

    const isCurrent = presetId === currentPresetId;

    if (isCurrent) {
      const presetToSet = getAdjacentPreset(presets, presetId)
      setCurrentPreset(presetToSet);
    }
  }, [setPresets, setCurrentPreset, presets, currentPreset]);

  const updatePreset = useCallback((
    presetId: string,
    updater: Partial<Preset> | ((preset: Preset) => Partial<Preset>)
  ) => {
    setPresets(prev =>
      prev.map(preset => {
        if (preset.id !== presetId) return preset;

        const updated =
          typeof updater === "function"
            ? updater(preset)
            : updater;

        return {
          ...preset,
          ...updated,
        };
      })
    );
  }, [setPresets]);

  const updateCurrentPreset = useCallback((
    updater: Partial<Preset> | ((preset: Preset) => Partial<Preset>)
  ) => {
    if (!currentPreset) return;

    updatePreset(currentPreset.id, updater);
  }, [currentPreset, updatePreset]);

  const updateCurrentPresetFields = useCallback((updater: (fields: FieldConfig[]) => FieldConfig[]) => {
    updateCurrentPreset(preset => ({
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

    const lastPreset = presetsById[lasPresetId];

    if (lastPreset) {
      setCurrentPreset(lastPreset);
      return;
    }

    if (presets?.length > 0) {
      setCurrentPreset(presets[0]);
      return;
    }

    createPreset()
  }, [presets, currentPreset, lasPresetId, setCurrentPreset, createPreset]);

  const exportPresets = useCallback(() => {
    const data = JSON.stringify(presets, null, EXPORT_CONFIG.INDENT_SPACES);
    const blob = new Blob([data], { type: EXPORT_CONFIG.FILE_TYPE });
    const url = URL.createObjectURL(blob);

    try {
      const a = document.createElement("a");
      a.download = EXPORT_CONFIG.FILE_NAME;
      a.href = url;
      a.click();
      a.remove()
    } catch {
      toast.error(t("presetsManager.messages.exportPreset.failed"));
    } finally {
      URL.revokeObjectURL(url)
    }
  }, [presets]);

  const parsePresets = useCallback(async (json: string) => {
    try {
      const imported: Preset[] = JSON.parse(json);

      if (!isValidPresetArray(imported)) {
        throw new Error(t("presetsManager.messages.importPreset.invalid"));
      }

      const existingIds = new Set(presets.map(preset => preset.id));

      const duplicated = imported.filter(preset =>
        existingIds.has(preset.id)
      );

      return {
        parsed: imported,
        duplicated,
      };
    } catch (error: Error | any) {
      const errorMessage = error.message ?? t("presetsManager.messages.importPreset.failed");

      toast.error(errorMessage);
      return null;
    }
  }, [presets]);

  const importPresets = useCallback(async (
    imported: Preset[],
    strategy: ImportStrategy = ImportStrategy.OVERWRITE
  ) => {
    if (strategy === ImportStrategy.REPLACE_ALL) {
      setPresets(imported);
      return;
    }

    setPresets(prev => {
      const map = new Map(prev.map(p => [p.id, p]));

      for (const preset of imported) {
        if (
          strategy === ImportStrategy.APPEND &&
          map.has(preset.id)
        ) continue;

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