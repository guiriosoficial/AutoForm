import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { StorageKeys, LOCALE_LANGUAGE_DEFAULT, type LocaleLanguage } from "@/configs";

export function useLanguages() {
  const { i18n } = useTranslation();

  const [language, setLanguage] = usePersistentState<LocaleLanguage>(
    StorageKeys.LANGUAGE,
    (i18n.resolvedLanguage as LocaleLanguage) ?? LOCALE_LANGUAGE_DEFAULT,
  );

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return [
    language,
    setLanguage
  ];
}
