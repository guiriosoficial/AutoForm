import {
  useCallback,
  useMemo,
  useState
} from "react";
import { toast } from "@/lib/toast"
import { generateFakerValue } from "@/lib/faker-generator";
import { createField, type FieldConfig } from "@/lib/fieldsConfig";

type UseFormArgs = {
  fields: FieldConfig[];
  setFields: (updater: (prev: FieldConfig[]) => FieldConfig[]) => void;
};

export function useForm({
  fields,
  setFields
}: UseFormArgs) {
  const [generatedValues, setGeneratedValues] = useState<Record<string, string>>({});

  const fieldsById = useMemo(() => {
    return Object.fromEntries(fields.map(f => [f.id, f]));
  }, [fields])

  const addField = useCallback(() => {
    setFields((prev) => [...prev, createField()]);
  }, [setFields]);

  const removeField = useCallback((id: string) => {
    setFields((prev) => prev.filter(f => f.id !== id));
  }, [setFields]);

  const updateField = useCallback((id: string, updated: FieldConfig) => {
    setFields((prev) => prev.map(f => (f.id === id ? updated : f)));
  }, [setFields]);

  // TODO: Review faker generator
  // TODO: Implement auto set on html fields
  const generateValues = useCallback(() => {
    const values: Record<string, string> = {};

    fields.forEach(f => {
      if (f.generator) values[f.id] = generateFakerValue(f.generator, f.options);
    });

    setGeneratedValues(values);
    toast.success("Valores gerados com sucesso!");
  }, [fields]);

  // TODO: Review faker generator
  // TODO: Implement auto set on html fields
  const regenerateValue = useCallback((fieldId: string) => {
    const field = fieldsById[fieldId];

    if (!field.generator) return;

    setGeneratedValues(prev => ({
      ...prev,
      [fieldId]: generateFakerValue(
        field.generator,
        field.options
      ),
    }));
  }, [fields]);

  const copyValue = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copiado!");
    } catch {
      toast.error("Não foi possível copiar");
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
      toast.success("JSON copiado!");
    } catch {
      toast.error("Não foi possível copiar");
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