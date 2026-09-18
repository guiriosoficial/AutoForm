import { useTranslation } from "react-i18next";
import { type RefObject, useCallback, useEffect, useMemo, useState } from "react";
import {
  type Preset,
  createEmptyPreset,
  getAdjacentPreset,
} from "@/lib/presets";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { isFunction, createNextSequencedName } from "@/lib/utils";
import { StorageKeys } from "@/configs";
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
  }, [presets, currentPresetId, updateCurrentPreset]);

  const detachGeneratorFromPresets = useCallback((generatorToRemove: string) => {
    setPresets((prevPresets) =>
      prevPresets.map((preset) => {
        const hasFieldWithGenerator = preset.fields
          .some((field) => field.generator === generatorToRemove);

        if (!hasFieldWithGenerator) return preset;

        return {
          ...preset,
          fields: preset.fields.map((field) =>
            field.generator === generatorToRemove
              ? { ...field, generator: "" }
              : field
          ),
        };
      })
    );
  }, [setPresets]);

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

  const isDuplicatedPresetName = useCallback((name: string, presetId?: string) => (
    presets.some((preset) => preset.name === name && preset.id !== presetId)
  ), [presets])

  return {
    presets,
    currentPreset,
    setCurrentPreset,
    createPreset,
    updateCurrentPreset,
    updateCurrentPresetName,
    updateCurrentPresetFields,
    detachGeneratorFromPresets,
    isDuplicatedPresetName,
    deletePreset,
    setPresets,
  };
}
