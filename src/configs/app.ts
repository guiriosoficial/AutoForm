export const APP_CONFIG = {
  name: __APP_NAME__,
  version: __APP_VERSION__,
  id: __APP_ID__,
} as const;

export const APP_NAME = APP_CONFIG.name;
export const APP_VERSION = APP_CONFIG.version;
export const APP_ID = APP_CONFIG.id;
export const APP_AUTHOR_URL = "https://github.com/guiriosoficial";
