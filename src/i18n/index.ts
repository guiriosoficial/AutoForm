import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { LANGUAGE_CONFIG, Language } from "@/configs";
import { enTranslations, ptBrTranslations } from "@/i18n/locales";

// oxlint-disable-next-line import/no-named-as-default-member
i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      [Language.EN]: { translation: enTranslations },
      [Language.PT_BR]: { translation: ptBrTranslations },
    },
    fallbackLng: LANGUAGE_CONFIG.DEFAULT,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator"],
      caches: [],
    },
  });

export default i18n;
