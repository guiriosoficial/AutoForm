import { APP_ID } from "./app";

export const EXPORT_CONFIG = {
  INDENT_SPACES: 2,
  FILE_TYPE: "application/json",
  FILE_NAME: `${APP_ID}-presets.json`,
} as const;
