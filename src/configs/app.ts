export const APP_CONFIG = {
  id: import.meta.env.VITE_APP_ID,
  name: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_APP_VERSION,
} as const;

export const APP_ID = APP_CONFIG.id;
export const APP_NAME = APP_CONFIG.name;
export const APP_VERSION = APP_CONFIG.version;
export const APP_AUTHOR_USER = "guiriosoficial";
export const APP_GITHUB_URL = "https://github.com";
export const APP_AUTHOR_URL = `${APP_GITHUB_URL}/${APP_AUTHOR_USER}`;
export const APP_URL = `${APP_GITHUB_URL}/${APP_AUTHOR_USER}/${APP_NAME}`;
