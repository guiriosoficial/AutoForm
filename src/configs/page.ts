export const Page = {
  SPONSOR: "https://github.com/sponsors/guiriosoficial?frequency=one-time&sponsor=guiriosoficial",
  HOME: "home",
  PREFERENCES: "preferences",
} as const;

export type Page = (typeof Page)[keyof typeof Page];

export const PAGE_CONFIG = {
  DEFAULT: Page.HOME,
} as const;
