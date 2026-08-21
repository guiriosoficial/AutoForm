import { allLocales } from "@faker-js/faker"

type LocaleMap = {
  [K in keyof typeof allLocales as Uppercase<K>]: K;
};

export const Locale = Object.fromEntries(
  Object.keys(allLocales).map((locale) => [
    locale.toUpperCase(),
    locale,
  ]),
) as LocaleMap;

export type Locale = typeof Locale[keyof typeof Locale];

const LOCALE_TRANSLATED_LIST = [
  Locale.EN,
  Locale.PT_BR,
] as const;

type LocaleLanguageMap = {
  [K in keyof typeof Locale as typeof Locale[K] extends typeof LOCALE_TRANSLATED_LIST[number] ? K : never]: typeof Locale[K];
};

export const LocaleLanguage = Object.fromEntries(
  Object.entries(Locale).filter(([_, value]) =>
    LOCALE_TRANSLATED_LIST.includes(value as typeof LOCALE_TRANSLATED_LIST[number]),
  ),
) as LocaleLanguageMap;

export type LocaleLanguage = typeof LocaleLanguage[keyof typeof LocaleLanguage];

export const LOCALE_DEFAULT = Locale.EN;
export const LOCALE_LANGUAGE_DEFAULT = LocaleLanguage.EN;
