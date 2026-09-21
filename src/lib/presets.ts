import { type FieldConfig, createField, isValidFieldArray } from "@/lib/fields";
import { isArray, isObject, isPopulatedString, isTimestamp } from "@/lib/utils";

export interface Preset {
  id: string;
  name: string;
  fields: FieldConfig[];
  createdAt: number;
}

export function createEmptyPreset(presetName: string): Preset {
  return {
    id: crypto.randomUUID(),
    name: presetName,
    fields: [createField()],
    createdAt: Date.now(),
  };
}

export function isValidPreset(value: unknown): value is Preset {
  if (!isObject(value)) return false;

  return (
    isPopulatedString(value.id) &&
    isPopulatedString(value.name) &&
    isTimestamp(value.createdAt) &&
    isValidFieldArray(value.fields)
  );
}

export function isValidPresetArray(value: unknown): value is Preset[] {
  return (
    isArray(value) &&
    value.every((item) => isValidPreset(item))
  );
}

export function getAdjacentPreset(presets: Preset[], currentPresetId: string) {
  const presetIndex = presets.findIndex((preset) => preset.id === currentPresetId);

  if (presetIndex === -1) return;

  const next = presets[presetIndex + 1];
  const previous = presets[presetIndex - 1];

  return next ?? previous;
}
