export const Language = {
  EN: "en",
  PT_BR: "pt-BR"
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const LANGUAGE_CONFIG = {
  DEFAULT: Language.EN
};
