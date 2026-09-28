export const PresetSorting = {
  DESC: "desc",
  ASC: "asc",
  CHRONOLOGICAL: "chronological",
} as const;

export type PresetSorting = (typeof PresetSorting)[keyof typeof PresetSorting];

export const PRESET_CONFIG = {
  DEFAULT_SORTING: PresetSorting.CHRONOLOGICAL,
}