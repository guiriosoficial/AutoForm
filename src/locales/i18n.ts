import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { LOCALE_DEFAULT, LocaleLanguages } from "@/configs";

import enTranslations from "@/locales/en";
import ptBrTranslations from "@/locales/pt-br";

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      [LocaleLanguages.EN]: enTranslations,
      [LocaleLanguages.PT_BR]: ptBrTranslations,
    },
    fallbackLng: LOCALE_DEFAULT,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['navigator'],
      caches: []
    }
  });
