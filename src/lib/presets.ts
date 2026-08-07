import {
  createField,
  isValidFieldArray,
  type FieldConfig
} from "./fieldsConfig";
import { isObject } from "./utils";
import {
  PRESET_DEFAULT_NAME,
  PRESET_DEFAULT_NAME_REGEX
} from "@/configs";

export interface Preset {
  id: string;
  name: string;
  fields: FieldConfig[];
  createdAt: number;
}

export const createEmptyPreset = (number: number): Preset => ({
  id: crypto.randomUUID(),
  name: `${PRESET_DEFAULT_NAME} ${number}`,
  fields: [createField()],
  createdAt: Date.now(),
});

export function getLastNewPresetNumber(presets: Preset[]) {
  return presets.reduce((max, preset) => {
    const match = preset.name.match(PRESET_DEFAULT_NAME_REGEX);

    if (!match) return max;

    return Math.max(max, Number(match[1]));
  }, 0);
}

export function getAdjacentPreset(presets: Preset[], current: Preset) {
  const presetIndex = presets.findIndex(p => p.id === current.id)

  if (presetIndex === -1) return null;

  return (
    presets[presetIndex + 1] ??
    presets[presetIndex - 1] ??
    null
  )
}

export function isValidPreset(value: unknown): value is Preset {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.createdAt === "number" &&
    isValidFieldArray(value.fields)
  );
}

export function isValidPresetArray(value: unknown): value is Preset[] {
  return (
    Array.isArray(value) &&
    value.every(isValidPreset)
  );
}
