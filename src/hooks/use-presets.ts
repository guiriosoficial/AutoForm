import { useTranslation } from "react-i18next";
import { type RefObject, useCallback, useEffect, useMemo } from "react";
import { type Preset, createEmptyPreset, getAdjacentPreset } from "@/lib/presets";
import { isFunction, createNextSequencedName } from "@/lib/utils";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { PresetSorting, StorageKeys } from "@/configs";
import type { InlineInputRef } from "@/components/shared/InlineInput";
import type { FieldConfig } from "@/lib/fields";

interface UsePresetsArgs {
  presetNameInputRef: RefObject<InlineInputRef | null>;
}

export function usePresets({
  presetNameInputRef,
}: UsePresetsArgs) {
  const { t } = useTranslation();
  const { presetsSorting, language } = useAppSettings();

  const [currentPresetId, setCurrentPresetId, , hydratedCurrentPresetId] =
    usePersistentState<string>(StorageKeys.CURRENT_PRESET_ID, "");
  const [presets, setPresets, , hydratedPresets] =
    usePersistentState<Preset[]>(StorageKeys.PRESETS, []);

  const presetsOptions = useMemo(() =>
    presets.toSorted((firstPreset, secondPreset) => {
      const nameComparison = firstPreset.name.localeCompare(secondPreset.name, language, {
        numeric: true,
        sensitivity: "base",
      });
      const createdAtComparison = firstPreset.createdAt - secondPreset.createdAt

      switch (presetsSorting) {
        case PresetSorting.NAME_ASC:
          return nameComparison
        case PresetSorting.NAME_DESC:
          return -nameComparison
        case PresetSorting.CREATED_AT_ASC:
          return createdAtComparison;
        case PresetSorting.CREATED_AT_DESC:
          return -createdAtComparison;
        default:
          return createdAtComparison;

      }
    }), [presets, presetsSorting, language]);

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
  }, [setCurrentPresetId]);

  const createPreset = useCallback(() => {
    const defaultName = t("configs.preset.defaultName");
    const nextPresetName = createNextSequencedName<Preset>(
      presets,
      "name",
      defaultName,
      { spaced: true },
    );
    const emptyPreset = createEmptyPreset(nextPresetName);
    const isFirstPreset = presets.length === 0;

    setPresets((prev) => [...prev, emptyPreset]);
    setCurrentPreset(emptyPreset);

    if (isFirstPreset) return;

    requestAnimationFrame(() => {
      presetNameInputRef.current?.startEditing();
    });
  }, [presets, presetNameInputRef, t, setPresets, setCurrentPreset]);

  const deletePreset = useCallback((presetId: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== presetId));

    const isCurrentPreset = presetId === currentPresetId;

    if (isCurrentPreset) {
      const replacementPreset = getAdjacentPreset(presets, presetId);
      setCurrentPreset(replacementPreset);
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
          updatedAt: Date.now()
        };
      }),
    );
  }, [setPresets]);

  const updateCurrentPreset = useCallback((updater: Partial<Preset> | ((preset: Preset) => Partial<Preset>)) => {
    if (!currentPreset) return;

    updatePreset(currentPreset.id, updater);
  }, [currentPreset, updatePreset]);

  const updateCurrentPresetFields = useCallback((updater: FieldConfig[] | ((fields: FieldConfig[]) => FieldConfig[])) => {
    updateCurrentPreset((preset) => {
      const updated = isFunction(updater)
        ? updater(preset.fields)
        : updater;

      return {
        fields: updated,
      }
    });
  }, [updateCurrentPreset]);

  const updateCurrentPresetName = useCallback((nextName: string) => {
    updateCurrentPreset(() => ({
      name: nextName,
    }));
  }, [updateCurrentPreset]);

  const removeGeneratorFromPresets = useCallback((generatorKey: string) => {
    setPresets((prevPresets) =>
      prevPresets.map((preset) => {
        const hasFieldWithGenerator = preset.fields
          .some((field) => field.generator === generatorKey);

        if (!hasFieldWithGenerator) return preset;

        return {
          ...preset,
          fields: preset.fields.map((field) =>
            field.generator === generatorKey
              ? { ...field, generator: "" }
              : field
          ),
        };
      })
    );
  }, [setPresets]);

  useEffect(() => {
    if (
      !hydratedCurrentPresetId ||
      !hydratedPresets ||
      currentPreset
    ) return;

    if (presets.length > 0) {
      setCurrentPreset(presets[0]);
      return;
    }

    createPreset();
  }, [presets, currentPreset, hydratedPresets, hydratedCurrentPresetId, setCurrentPreset, createPreset]);

  const isPresetNameTaken = useCallback((name: string, excludedPresetId?: string) => (
    presets.some((preset) => preset.name === name && preset.id !== excludedPresetId)
  ), [presets]);

  return {
    presets,
    presetsOptions,
    currentPreset,
    setCurrentPreset,
    createPreset,
    updateCurrentPreset,
    updateCurrentPresetName,
    updateCurrentPresetFields,
    removeGeneratorFromPresets,
    isPresetNameTaken,
    deletePreset,
    setPresets,
  };
}
