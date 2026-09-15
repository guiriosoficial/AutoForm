import JSON5 from "json5";
import { EDITOR_CONFIG } from "@/configs";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export function stringifyJson5(json: JsonValue) {
  return JSON5.stringify(json, { space: EDITOR_CONFIG.INDENT_SPACES });
}

export function parseJson5<T = unknown>(text: string): T {
  return JSON5.parse(text);
}
