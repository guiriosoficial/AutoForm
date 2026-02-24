import {useState} from "react";
import type {FieldConfig} from "@/lib/faker-options.ts";
import {generateFakerValue} from "@/lib/faker-generator.ts";
import {toast} from "sonner";

const createField = (): FieldConfig => ({
    id: crypto.randomUUID(),
    selector: "",
    fakerType: "",
});

export function useForm () {
    const [fields, setFields] = useState<FieldConfig[]>([createField()]);
    const [generatedValues, setGeneratedValues] = useState<Record<string, string>>({});

    const addField = () => setFields(prev => [...prev, createField()]);

    const removeField = (id: string) => {
        setFields(prev => prev.length > 1 ? prev.filter(f => f.id !== id) : prev);
    };

    const updateField = (id: string, updated: FieldConfig) => {
        setFields(prev => prev.map(f => f.id === id ? updated : f));
    };

    const generate = () => {
        const values: Record<string, string> = {};
        fields.forEach(f => {
            if (f.fakerType) {
                values[f.id] = generateFakerValue(f.fakerType, f.config);
            }
        });
        setGeneratedValues(values);
        toast.success("Valores gerados com sucesso!");
    };

    const regenerate = (fieldId: string, fakerType: string) => {
        if (fakerType) {
            const field = fields.find(f => f.id === fieldId);
            setGeneratedValues(prev => ({ ...prev, [fieldId]: generateFakerValue(fakerType, field?.config) }));
        }
    };

    const copyValue = (value: string) => {
        navigator.clipboard.writeText(value);
        toast.success("Copiado!");
    };

    const copyAllAsJSON = () => {
        const data: Record<string, string> = {};
        fields.forEach(f => {
            if (generatedValues[f.id]) {
                data[f.selector || f.id] = generatedValues[f.id];
            }
        });
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        toast.success("JSON copiado!");
    };

    return {
        copyValue,
        copyAllAsJSON,
        regenerate,
        generate,
        updateField,
        removeField,
        addField,
        generatedValues,
        fields,
        setFields
    }
}