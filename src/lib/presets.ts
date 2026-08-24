import { createField, isValidFieldArray, type FieldConfig } from "@/lib/fields-config";
import { isObject } from "@/lib/utils";
import { PRESET_DEFAULT_NAME } from "@/configs";

export interface Preset {
  id: string;
  name: string;
  fields: FieldConfig[];
  createdAt: number;
}

export const presetDefaultNameRegex = new RegExp(`^${PRESET_DEFAULT_NAME} (\\d+)$`)

export const createEmptyPreset = (number: number): Preset => ({
  id: crypto.randomUUID(),
  name: `${PRESET_DEFAULT_NAME} ${number}`,
  fields: [createField()],
  createdAt: Date.now(),
});

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

export function getNewPresetNumber(presets: Preset[]) {
  return presets.reduce((max, preset) => {
    const match = preset.name.match(presetDefaultNameRegex);

    if (!match) return max;

    return Math.max(max, Number(match[1]));
  }, 0);
}

export function getAdjacentPreset(presets: Preset[], currentPresetId: string) {
  const presetIndex = presets.findIndex(p => p.id === currentPresetId)

  if (presetIndex === -1) return null;

  const next = presets[presetIndex + 1];
  const previous = presets[presetIndex - 1];

  return next ?? previous ?? null;
}
