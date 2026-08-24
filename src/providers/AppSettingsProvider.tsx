import { createContext, useEffect, type ReactNode } from "react"
import { usePersistentState } from "@/hooks/use-persistent-state";
import {ImportStrategy, Locale, LocaleLanguage, StorageKeys, Theme} from "@/configs";
import i18n from "i18next";

interface AppSettingsProviderProps {
  children: ReactNode
}

interface AppSettingsProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  importStrategy: ImportStrategy
  setImportStrategy: (strategy: ImportStrategy) => void
  language: LocaleLanguage
  setLanguage: (language: LocaleLanguage) => void
  locale: Locale
  setLocale: (locale: Locale) => void
}

const initialState: AppSettingsProviderState = {
  theme: Theme.SYSTEM,
  setTheme: () => null,
  importStrategy: ImportStrategy.ALWAYS_ASK,
  setImportStrategy: () => null,
  language: LocaleLanguage.EN,
  setLanguage: () => null,
  locale: Locale.EN,
  setLocale: () => null,
}

export const AppSettingsProviderContext = createContext<AppSettingsProviderState>(initialState)

export function AppSettingsProvider({
  children,
}: AppSettingsProviderProps) {
  const [importStrategy, setImportStrategy] = usePersistentState<ImportStrategy>(StorageKeys.IMPORT_STRATEGY, ImportStrategy.ALWAYS_ASK)
  const [language, setLanguage] = usePersistentState<LocaleLanguage>(StorageKeys.LANGUAGE, LocaleLanguage.EN)
  const [locale, setLocale] = usePersistentState<Locale>(StorageKeys.LOCALE, Locale.EN)
  const [theme, setTheme] = usePersistentState<Theme>(StorageKeys.THEME, Theme.SYSTEM)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(Theme.LIGHT, Theme.DARK)

    if (theme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const html = window.document.documentElement;
    html.lang = language.replace("_", "-");

    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    // TODO: Implement this effect to change faker locale
  }, []);

  const value = {
    theme,
    setTheme,
    importStrategy,
    setImportStrategy,
    language,
    setLanguage,
    locale,
    setLocale
  }

  return (
    <AppSettingsProviderContext value={value}>
      {children}
    </AppSettingsProviderContext>
  )
}
