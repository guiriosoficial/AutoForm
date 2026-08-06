import { APP_ID } from "@/configs";

export const STORAGE_PERSISTENCE_DELAY_MS = 500;
export const STORAGE_EVENT_NAME = "storage";

export const LocalStorageKeys = {
  PRESETS: `${APP_ID}:presets`,
} as const;

export type LocalStorageKeys = (typeof LocalStorageKeys)[keyof typeof LocalStorageKeys];