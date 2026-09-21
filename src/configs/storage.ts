import { APP_ID } from "./app";

export const STORAGE_CONFIG = {
  PERSISTENCE_DELAY_MS: 500,
} as const;

export const StorageAreaNames = {
  LOCAL: "local",
  SYNC: "sync",
  MANAGED: "managed",
  SESSION: "session",
} as const;

export const StorageKeys = {
  LAST_GENERATED_VALUES: `${APP_ID}:last-generated-values`,
  LAST_PRESET_ID: `${APP_ID}:last-preset-id`,
  PRESETS: `${APP_ID}:presets`,
  THEME: `${APP_ID}:theme`,
  LOCALE: `${APP_ID}:locale`,
  LANGUAGE: `${APP_ID}:language`,
  IMPORT_STRATEGY: `${APP_ID}:import-strategy`,
  CUSTOM_METHODS: `${APP_ID}:custom-methods`,
  AVAILABLE_CATALOGS: `${APP_ID}:available-catalogs`,
  AUTO_FORMAT: `${APP_ID}:auto-format`,
} as const;

export type StorageKeys = (typeof StorageKeys)[keyof typeof StorageKeys];

