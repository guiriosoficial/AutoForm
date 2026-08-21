import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { LOCALE_LANGUAGE_DEFAULT, LocaleLanguage } from "@/configs";
import {
  enTranslations,
  ptBrTranslations
} from '@/locales'

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      [LocaleLanguage.EN]: { translation:  enTranslations },
      [LocaleLanguage.PT_BR]: { translation: ptBrTranslations },
    },
    fallbackLng: LOCALE_LANGUAGE_DEFAULT,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['navigator'],
      caches: []
    }
  });

