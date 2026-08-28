import i18n from "@/i18n";
import { createField, isValidFieldArray, type FieldConfig } from "@/lib/fields";
import { isPopulatedString, isTimestamp, isObject } from "@/lib/guards";

export interface Preset {
  id: string;
  name: string;
  fields: FieldConfig[];
  createdAt: number;
}

export const getPresetDefaultName = (): string => {
  return i18n.t("configs.preset.defaultName");
};

export const getPresetDefaultNameRegex = (): RegExp => {
  const baseName = getPresetDefaultName();
  const escapedName = baseName.replace(/[^\w\s]/gu, "\\$&");
  return new RegExp(`^${escapedName} (\\d+)$`);
};

export const createEmptyPreset = (number: number): Preset => ({
  id: crypto.randomUUID(),
  name: `${getPresetDefaultName()} ${number}`,
  fields: [createField()],
  createdAt: Date.now(),
});

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
    Array.isArray(value) &&
    value.every(isValidPreset)
  );
}

export function getNewPresetNumber(presets: Preset[]) {
  return presets.reduce((max, preset) => {
    const regex = getPresetDefaultNameRegex();
    const match = preset.name.match(regex)

    if (!match) return max;

    return Math.max(max, Number(match[1]));
  }, 0);
}

export function getAdjacentPreset(presets: Preset[], currentPresetId: string) {
  const presetIndex = presets.findIndex(p => p.id === currentPresetId);

  if (presetIndex === -1) return null;

  const next = presets[presetIndex + 1];
  const previous = presets[presetIndex - 1];

  return next ?? previous ?? null;
}
