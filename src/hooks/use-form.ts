import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { toast } from "@/lib/toast"
import { generateValue, fillInputElement } from "@/lib/generator";
import { createField, type FieldConfig } from "@/lib/fields";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { StorageKeys } from "@/configs";

interface UseFormArgs {
  presetId: string;
  fields: FieldConfig[];
  updateFields: (updater: (prev: FieldConfig[]) => FieldConfig[]) => void;
}

// type GeneratedValue = {
//   isError: true;
//   errorMessage: string;
//   errorType: string
// } | {
//   isError: false;
//   value: string;
// }

type ValuesByPresetId = Record<string, Record<string, string>>

export function useForm({
  presetId,
  fields,
  updateFields
}: UseFormArgs) {
  const { t } = useTranslation();

  const [generatedValuesByPresetId, setGeneratedValuesByPresetId] = usePersistentState<ValuesByPresetId>(StorageKeys.LAST_GENERATED_VALUES, {});

  const generatedValues = useMemo(() => {
    return generatedValuesByPresetId[presetId] ?? {};
  }, [generatedValuesByPresetId, presetId])

  const setGeneratedValues = useCallback((
    valuesOrUpdater:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => {
    setGeneratedValuesByPresetId(prev => {
      const currentValues = prev[presetId] ?? {};

      const values =
        typeof valuesOrUpdater === "function"
          ? valuesOrUpdater(currentValues)
          : valuesOrUpdater;

      return {
        ...prev,
        [presetId]: values,
      };
    });
  }, [presetId, setGeneratedValuesByPresetId]);

  const fieldsById = useMemo(() => {
    return Object.fromEntries(
      fields.map(f => [f.id, f])
    );
  }, [fields])

  const addField = useCallback(() => {
    updateFields((prev) =>
      [...prev, createField()])
    ;
  }, [updateFields]);

  const removeField = useCallback((id: string) => {
    updateFields((prev) =>
      prev.filter(f => f.id !== id)
    );
  }, [updateFields]);

  const updateField = useCallback((id: string, updated: FieldConfig) => {
    updateFields((prev) =>
      prev.map(f => (f.id === id ? updated : f))
    );
  }, [updateFields]);

  const generateValues = useCallback(() => {
    const values: Record<string, string> = {};

    fields.forEach(f => {
      if (!f.generator) return;

      const newValue = generateValue(f.generator, f.options)

      if (!newValue) return;

      values[f.id] = newValue;
      fillInputElement(f.selector, newValue)
    });

    setGeneratedValues(values);
  }, [fields]);

  const regenerateValue = useCallback((fieldId: string) => {
    const field = fieldsById[fieldId];

    if (!field.generator) return;

    const newValue = generateValue(field.generator, field.options)

    if (!newValue) return;

    setGeneratedValues(prev => ({
      ...prev,
      [fieldId]: newValue,
    }));
    fillInputElement(field.selector, newValue)
  }, [fields]);

  const copyValue = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("fieldsManager.messages.copyValue.success"));
    } catch {
      toast.error(t("fieldsManager.messages.copyValue.failed"));
    }
  }, []);

  const copyFormAsJSON = useCallback(async () => {
    try {
      const data: Record<string, string> = {};

      fields.forEach(f => {
        if (generatedValues[f.id]) data[f.selector || f.id] = generatedValues[f.id];
      });

      const value = JSON.stringify(data, null, 2)
      await navigator.clipboard.writeText(value);
      toast.success(t("footer.messages.copyJson.success"));
    } catch {
      toast.error(t("footer.messages.copyJson.failed"));
    }
  }, [fields, generatedValues]);

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