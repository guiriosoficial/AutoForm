import {isObject} from "@/lib/utils.ts";

export interface FieldConfig {
  id: string;
  selectorString: string;
  methodType: string;
  config?: string;
}

export const createField = (): FieldConfig => ({
  id: crypto.randomUUID(),
  selectorString: "",
  methodType: "",
});


export function isValidField(value: unknown): value is FieldConfig {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.selectorString === "string" &&
    typeof value.methodType === "string" &&
    (
      value.config === undefined ||
      typeof value.config === "string"
    )
  );
}

export function isValidFieldArray(value: unknown): value is FieldConfig[] {
  return (
    Array.isArray(value) &&
    value.every(isValidField)
  );
}