import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { useCatalog } from "@/hooks/use-catalog";
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

interface UseFormArgs {
  presetId: string;
  fields: FieldConfig[];
  updateFields: (updater: (prev: FieldConfig[]) => FieldConfig[]) => void;
}

export type GeneratedValuesJson = Record<string, GeneratorValue>;
export type GeneratedValues = Record<string, FieldResult>;
export type ValuesByPresetId = Record<string, GeneratedValues>;

export function useForm({
  presetId,
  fields,
  updateFields,
}: UseFormArgs) {
  const { t } = useTranslation();
  const { catalogMethodsByKey } = useCatalog();

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
      const currentValues = prev[presetId] ?? {};

        const values = isFunction(valuesOrUpdater)
          ? valuesOrUpdater(currentValues)
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

  const removeField = useCallback((id: string) => {
    updateFields((prev) => prev.filter(field => field.id !== id));
  }, [updateFields]);

  const updateField = useCallback((id: string, updated: FieldConfig) => {
    updateFields((prev) =>
      prev.map(field => (field.id === id ? updated : field))
    );
  }, [updateFields]);

  const generateValues = useCallback(async () => {
    const values: GeneratedValues = {};

    await Promise.all(
      fields.map(async (field) => {
        const method = catalogMethodsByKey.get(field.generator);

        if (!method) return;

        const generatedValue = await generateValue(method, field.options);

        if (!generatedValue) return;

        values[field.id] = createFieldResult.value(generatedValue);

        await fillInputElement(field.selector, generatedValue);
      }),
    );

    setGeneratedValues(values);
  }, [fields, catalogMethodsByKey, setGeneratedValues]);

  const regenerateValue = useCallback(async (fieldId: string) => {
    const field = fieldsById[fieldId];

    const method = catalogMethodsByKey.get(field.generator);

    if (!method) return;

    const generatedValue = await generateValue(method, field.options);

    if (!generatedValue) return;

    setGeneratedValues(prev => ({
      ...prev,
      [fieldId]: createFieldResult.value(generatedValue),
    }));
    await fillInputElement(field.selector, generatedValue);
  }, [fieldsById, catalogMethodsByKey, setGeneratedValues]);

  const copyValue = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("fieldsManager.messages.copyValue.success"));
    } catch {
      toast.error(t("fieldsManager.messages.copyValue.failed"));
    }
  }, [t]);

  const copyFormAsJSON = useCallback(async () => {
    try {
      const data: GeneratedValuesJson = {};

      for (const field of fields) {
        const generatedValue = generatedValues[field.id];

        if (!generatedValue) continue;

        data[field.selector || field.id] = generatedValue.value;
      }

      const value = JSON.stringify(data, null, EXPORT_CONFIG.INDENT_SPACES);
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
    regenerateValue,
    copyValue,
    copyFormAsJSON,
  };
}
