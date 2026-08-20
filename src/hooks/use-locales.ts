import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { StorageKeys, LOCALE_DEFAULT, type LocaleLanguages } from "@/configs";

export function useLocales() {
  const { i18n } = useTranslation();

  const [locale, setLocale] = usePersistentState<LocaleLanguages>(
    StorageKeys.LOCALE,
    (i18n.resolvedLanguage as LocaleLanguages) ?? LOCALE_DEFAULT,
  );
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  return [
    locale,
    setLocale
  ];
}