import { allLocales } from "@faker-js/faker";

type LocaleMap = {
  [K in keyof typeof allLocales as Uppercase<K>]: K;
};

export const Locale = Object.fromEntries(
  Object.keys(allLocales)
    .filter((locale) => locale !== "base")
    .map((locale) => [locale.toUpperCase(), locale]),
) as LocaleMap;

export type Locale = (typeof Locale)[keyof typeof Locale];

export const LOCALE_CONFIG = {
  DEFAULT: Locale.EN,
} as const;
