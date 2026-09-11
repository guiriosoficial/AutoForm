import { isObject, isOptionalString, isPopulatedString } from "@/lib/guards";

export interface FieldConfig {
  id: string;
  selector: string;
  generator: string;
  options?: string;
}

export const FieldErrorType = {
  EMPTY_SELECTOR: "empty-selector",
  EMPTY_METHOD: "empty-method",
  INVALID_METHOD: "invalid-method",
  INVALID_OPTIONS: "invalid-options",
  INVALID_SELECTOR: "invalid-selector",
} as const;

export type FieldErrorType = (typeof FieldErrorType)[keyof typeof FieldErrorType];

export class FieldError {
  constructor(
    readonly type: FieldErrorType,
    readonly message: string
  ) {}
}

export class FieldResult {
  constructor(
    readonly value: string | undefined,
    readonly error: FieldError | undefined
  ) {}

  addError(type: FieldErrorType, message: string) {
    return new FieldResult(
      this.value,
      new FieldError(type, message)
    );
  }
}

export const createFieldResult = {
  value(value: string) {
    return new FieldResult(value, undefined);
  },

  error(type: FieldErrorType, message: string) {
    return new FieldResult(
      undefined,
      new FieldError(type, message)
    );
  }
};

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
    value.every((item) => isValidField(item))
  );
}
