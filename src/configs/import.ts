export const IMPORT_CONFIG = {
  FILE_TYPE: "application/json",
  REPLACE_ALL_THRESHOLD: 1,
} as const

export const ImportStrategy = {
  APPEND: "append",
  OVERWRITE: "overwrite",
  REPLACE_ALL: "replaceAll",
} as const;

export type ImportStrategy = typeof ImportStrategy[keyof typeof ImportStrategy];

export const IMPORT_FILE_TYPE= "application/json";
export const IMPORT_REPLACE_ALL_THRESHOLD = 1