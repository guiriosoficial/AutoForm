import { isObject, isOptionalString, isPopulatedString } from "@/lib/guards";

export interface FieldConfig {
  id: string;
  selector: string;
  generator: string;
  options?: string;
}

export const createField = (): FieldConfig => ({
  id: crypto.randomUUID(),
  selector: "",
  generator: "",
});

export function isValidField(value: unknown): value is FieldConfig {
  if (!isObject(value)) return false;

  return (
    isPopulatedString(value.id) &&
    isOptionalString(value.selector) &&
    isOptionalString(value.generator) &&
    isOptionalString(value.options)
  );
}

export function isValidFieldArray(value: unknown): value is FieldConfig[] {
  return (
    Array.isArray(value) &&
    value.every(isValidField)
  );
}
