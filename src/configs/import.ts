export const ImportStrategy = {
  REPLACE_ALL: "replace-all",
  REPLACE: "replace",
  MERGE: "merge",
} as const;

export type ImportStrategy = typeof ImportStrategy[keyof typeof ImportStrategy];

export const IMPORT_FILE_TYPE= "application/json";