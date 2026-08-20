import { APP_ID } from "@/configs";

export const STORAGE_PERSISTENCE_DELAY_MS = 500;

export const StorageKeys = {
  PRESETS: `${APP_ID}:presets`,
  LAST_GENERATED_VALUES: `${APP_ID}:last-generated-values`,
  LAST_PRESET_ID: `${APP_ID}:last-preset-id`,
  THEME: `${APP_ID}:theme`,
  LOCALE: `${APP_ID}:locale`,
} as const;

export type StorageKeys = typeof StorageKeys[keyof typeof StorageKeys];
