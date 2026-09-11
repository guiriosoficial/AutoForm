import JSON5 from 'json5';
import { EDITOR_CONFIG } from "@/configs";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

interface StringifyOptions {
  replacer?:
    | ((this: unknown, key: string, value: unknown) => unknown)
    | (string | number)[]
    | null;
  space?: string | number | null;
  quote?: string | null;
}

const defaultStringifyOptions: StringifyOptions = {
  space: EDITOR_CONFIG.INDENT_SPACES,
};

export function stringifyJson5(
  json: JsonValue,
  options: StringifyOptions = defaultStringifyOptions
) {
  return JSON5.stringify(json, options);
}


export function parseJson5<T = unknown>(text: string): T {
  return JSON5.parse(text);
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
