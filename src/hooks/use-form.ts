import { useCallback, useMemo, useState } from "react";
import type { FieldConfig } from "@/lib/faker-options.ts";
import { generateFakerValue } from "@/lib/faker-generator.ts";
import { toast } from "sonner";

export const createField = (): FieldConfig => ({
    id: crypto.randomUUID(),
    selector: "",
    fakerType: "",
});

type UseFormArgs = {
    fields: FieldConfig[];
    setFields: (updater: (prev: FieldConfig[]) => FieldConfig[]) => void;
};

export function useForm({
  fields,
  setFields
}: UseFormArgs) {
    const [generatedValues, setGeneratedValues] = useState<Record<string, string>>({});

    const addField = useCallback(() => {
        setFields(prev => [...prev, createField()]);
    }, [setFields]);

    const removeField = useCallback((id: string) => {
        setFields(prev => prev.filter(f => f.id !== id));
    }, [setFields]);

    const updateField = useCallback((id: string, updated: FieldConfig) => {
        setFields(prev => prev.map(f => (f.id === id ? updated : f)));
    }, [setFields]);

    // TODO: Review faker generator
    // TODO: Implement auto set on html fields
    const generateValues = useCallback(() => {
        const values: Record<string, string> = {};

        fields.forEach(f => {
            if (f.fakerType) values[f.id] = generateFakerValue(f.fakerType, f.config);
        });

        setGeneratedValues(values);
        toast.success("Valores gerados com sucesso!");
    }, [fields]);

    // TODO: Review faker generator
    // TODO: Implement auto set on html fields
    const regenerateValue = useCallback((fieldId: string, fakerType: string) => {
          if (!fakerType) return;

          const field = fields.find(f => f.id === fieldId);
          setGeneratedValues(prev => ({
              ...prev,
              [fieldId]: generateFakerValue(fakerType, field?.config),
          }));
      }, [fields]
    );

    const copyValue = useCallback(async (value: string) => {
        await navigator.clipboard.writeText(value);
        toast.success("Copiado!");
    }, []);

    const copyValuesAsJSON = useCallback(async () => {
        const data: Record<string, string> = {};

        fields.forEach(f => {
            if (generatedValues[f.id]) data[f.selector || f.id] = generatedValues[f.id];
        });

        const value = JSON.stringify(data, null, 2)
        await navigator.clipboard.writeText(value);
        toast.success("JSON copiado!");
    }, [fields, generatedValues]);

    return useMemo(
      () => ({
          generatedValues,
          setGeneratedValues,
          addField,
          removeField,
          updateField,
          generateValues,
          regenerateValue,
          copyValue,
          copyValuesAsJSON,
      }),
      [
          generatedValues,
          addField,
          removeField,
          updateField,
          generateValues,
          regenerateValue,
          copyValue,
          copyValuesAsJSON,
      ]
    );
}