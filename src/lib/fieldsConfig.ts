import {isObject} from "@/lib/utils.ts";

export interface FieldConfig {
  id: string;
  selector: string;
  generator: string;
  options?: Record<string, unknown>;
}

export const createField = (): FieldConfig => ({
  id: crypto.randomUUID(),
  selector: "",
  generator: "",
});


export function isValidField(value: unknown): value is FieldConfig {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.selector === "string" &&
    typeof value.generator === "string" &&
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