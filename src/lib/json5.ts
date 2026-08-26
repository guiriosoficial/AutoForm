import JSON5 from 'json5'
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
    | ((this: any, key: string, value: any) => any)
    | (string | number)[]
    | null
  space?: string | number | null
  quote?: string | null
}

export function parseJson5<T = any>(text: string): T {
  return JSON5.parse(text)
}

export function stringifyJson5(
  json: JsonValue,
  options: StringifyOptions = { space: EDITOR_CONFIG.INDENT_SPACES }
) {
  return JSON5.stringify(json, options)
}

export function isPopulatedJson5(input: string | undefined) {
  if (!input) return false;

  const trimmed = input.trim();

  return (
    !!trimmed &&
    !/^\{\s*}$/.test(trimmed) &&
    !/^\[\s*\]$/.test(trimmed) &&
    !/^(['"]) *\1$/.test(trimmed)
  );
}
