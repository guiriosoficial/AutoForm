export function isNil(value: unknown): value is undefined | null {
  return value === undefined || value === null;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isOptionalString(value: unknown): value is string | null | undefined {
  return isNil(value) || isString(value);
}

export function isPopulatedString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

export function isFiniteNumber(value: unknown): value is number {
  return Number.isFinite(value);
}

export function isNaN(value: unknown): value is number & { readonly __brand: "NaN" } {
  return Number.isNaN(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && !isArray(value) && !isNil(value);
}

export function isFunction(value: unknown): value is (...args: never[]) => unknown {
  return typeof value === "function";
}

export function isTimestamp(value: unknown): value is number {
  return isFiniteNumber(value) && !isNaN(new Date(value).getTime());
}

export function isPopulatedJson5(input: string | undefined) {
  if (!input) return false;

  const trimmed = input.trim();

  return (
    !!trimmed &&
    !/^\{\s*\}$/u.test(trimmed) &&
    !/^\[\s*\]$/u.test(trimmed) &&
    !/^(?<quote>['"]) *\k<quote>$/u.test(trimmed)
  );
}
