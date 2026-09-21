import { APP_AUTHOR_USER, APP_GITHUB_URL } from "@/configs/app";

export const Page = {
  SPONSOR: `${APP_GITHUB_URL}/sponsors/${APP_AUTHOR_USER}?frequency=one-time`,
  HOME: "home",
  PREFERENCES: "preferences",
} as const;

export type Page = (typeof Page)[keyof typeof Page];

export const PAGE_CONFIG = {
  DEFAULT: Page.HOME,
  EXTERNAL_URL_PROTOCOL: "https:",
} as const;
