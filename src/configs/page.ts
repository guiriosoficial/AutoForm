export const Page = {
  HOME: "home",
  PREFERENCES: "preferences",
} as const;

export type Page = (typeof Page)[keyof typeof Page];

export const PAGE_CONFIG = {
  DEFAULT: Page.HOME,
} as const;