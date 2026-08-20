export const LocaleLanguages = {
  EN: "en",
  PT_BR: "pt-BR",
} as const;

export type LocaleLanguages = typeof LocaleLanguages[keyof typeof LocaleLanguages];

export const LOCALE_DEFAULT = LocaleLanguages.EN;
