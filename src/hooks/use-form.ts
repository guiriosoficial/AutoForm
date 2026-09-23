import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { toast } from "@/lib/toast";
import { isFunction } from "@/lib/utils";
import { type GeneratorValue, generateValue, fillInputElement } from "@/lib/generator";
import {
  type FieldConfig,
  type FieldResult,
  createField,
  createFieldResult,
} from "@/lib/fields";
import { EXPORT_CONFIG, StorageKeys } from "@/configs";
import type { CatalogMethod } from "@/lib/catalog";

interface UseFormArgs {
  presetId: string;
  fields: FieldConfig[];
  updateFields: (updater: (prev: FieldConfig[]) => FieldConfig[]) => void;
  catalogMethodsByKey: Map<string, CatalogMethod>;
}

export type GeneratedValuesJson = Record<string, GeneratorValue>;
export type GeneratedValues = Record<string, FieldResult>;
export type ValuesByPresetId = Record<string, GeneratedValues>;

export function useForm({
  presetId,
  fields,
  updateFields,
  catalogMethodsByKey,
}: UseFormArgs) {
  const { t } = useTranslation();

  const [generatedValuesByPresetId, setGeneratedValuesByPresetId] =
    usePersistentState<ValuesByPresetId>(StorageKeys.LAST_GENERATED_VALUES, {});

  const generatedValues = useMemo(
    () => generatedValuesByPresetId[presetId] ?? {},
    [generatedValuesByPresetId, presetId],
  );

  const setGeneratedValues = useCallback((
    valuesOrUpdater:
      | GeneratedValues
      | ((prev: GeneratedValues) => GeneratedValues)
  ) => {
    setGeneratedValuesByPresetId(prev => {
      const currentPresetValues = prev[presetId] ?? {};

        const values = isFunction(valuesOrUpdater)
          ? valuesOrUpdater(currentPresetValues)
          : valuesOrUpdater;

        return {
          ...prev,
          [presetId]: values,
        };
      });
    }, [presetId, setGeneratedValuesByPresetId]);

  const fieldsById = useMemo(() =>
    Object.fromEntries(
      fields.map(field => [field.id, field])
    ), [fields]);

  const addField = useCallback(() => {
    updateFields((prev) => [...prev, createField()]);
  }, [updateFields]);

  const removeField = useCallback((fieldId: string) => {
    updateFields((prev) => prev.filter((field) => field.id !== fieldId));
  }, [updateFields]);

  const updateField = useCallback((fieldId: string, updatedField: FieldConfig) => {
    updateFields((prev) =>
      prev.map((field) => (field.id === fieldId ? updatedField : field))
    );
  }, [updateFields]);

  const generateValues = useCallback(async () => {
    const generatedFieldValues: GeneratedValues = {};

    await Promise.all(
      fields.map(async (field) => {
        const method = catalogMethodsByKey.get(field.generator);

        if (!method) return;

        const generatedValue = await generateValue(method, field.options);

        if (!generatedValue) return;

        generatedFieldValues[field.id] = createFieldResult.value(generatedValue);

        await fillInputElement(field.selector, generatedValue);
      }),
    );

    setGeneratedValues(generatedFieldValues);
  }, [fields, catalogMethodsByKey, setGeneratedValues]);

  const regenerateFieldValue = useCallback(async (fieldId: string) => {
    const field = fieldsById[fieldId];

    if (!field) return;

    const method = catalogMethodsByKey.get(field.generator);

    if (!method) return;

    const generatedValue = await generateValue(method, field.options);

    if (!generatedValue) return;

    setGeneratedValues((prev) => ({
      ...prev,
      [fieldId]: createFieldResult.value(generatedValue),
    }));
    await fillInputElement(field.selector, generatedValue);
  }, [fieldsById, catalogMethodsByKey, setGeneratedValues]);

  const copyGeneratedValue = useCallback(async (generatedValue: string) => {
    try {
      await navigator.clipboard.writeText(generatedValue);
      toast.success(t("fieldsManager.messages.copyValue.success"));
    } catch {
      toast.error(t("fieldsManager.messages.copyValue.failed"));
    }
  }, [t]);

  useEffect(() => {
    if (presetId && fields.length === 0) addField();
  }, [fields, presetId, addField]);

  const copyFieldsAsJSON = useCallback(async () => {
    try {
      const fieldsData: GeneratedValuesJson = {};

      for (const field of fields) {
        const generatedValue = generatedValues[field.id];

        if (!generatedValue) continue;

        fieldsData[field.selector || field.id] = generatedValue.value;
      }

      const value = JSON.stringify(fieldsData, null, EXPORT_CONFIG.INDENT_SPACES);
      await navigator.clipboard.writeText(value);
      toast.success(t("footer.messages.copyJson.success"));
    } catch {
      toast.error(t("footer.messages.copyJson.failed"));
    }
  }, [fields, generatedValues, t]);

  return {
    generatedValues,
    addField,
    removeField,
    updateField,
    generateValues,
    regenerateFieldValue,
    copyGeneratedValue,
    copyFieldsAsJSON,
  };
}
