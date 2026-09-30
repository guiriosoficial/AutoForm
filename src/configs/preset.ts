export const PresetSorting = {
  NAME_ASC: "nameAsc",
  NAME_DESC: "nameDesc",
  CREATED_AT_ASC: "createdAtAsc",
  CREATED_AT_DESC: "createdAtDesc",
} as const;

export type PresetSorting =
  (typeof PresetSorting)[keyof typeof PresetSorting];

export const PRESET_CONFIG = {
  DEFAULT_SORTING: PresetSorting.CREATED_AT_ASC,
}