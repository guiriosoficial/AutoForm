import i18n from "@/i18n";
import { useEffect, useContext, createContext, type ReactNode } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import {
  LOCALE_CONFIG,
  LANGUAGE_CONFIG,
  THEME_CONFIG,
  IMPORT_CONFIG,
  ImportStrategy,
  Locale,
  Language,
  StorageKeys,
  Theme,
} from "@/configs";

interface AppSettingsProviderProps {
  children: ReactNode;
}

interface AppSettingsProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  importStrategy: ImportStrategy;
  setImportStrategy: (strategy: ImportStrategy) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const initialState: AppSettingsProviderState = {
  theme: THEME_CONFIG.DEFAULT,
  setTheme: () => null,
  importStrategy: IMPORT_CONFIG.STRATEGY_DEFAULT,
  setImportStrategy: () => null,
  language: LANGUAGE_CONFIG.DEFAULT,
  setLanguage: () => null,
  locale: LOCALE_CONFIG.DEFAULT,
  setLocale: () => null,
};

export const AppSettingsProviderContext = createContext<AppSettingsProviderState>(initialState);

export function AppSettingsProvider({
  children,
}: AppSettingsProviderProps) {
  const [importStrategy, setImportStrategy] = usePersistentState<ImportStrategy>(StorageKeys.IMPORT_STRATEGY, IMPORT_CONFIG.STRATEGY_DEFAULT);
  const [language, setLanguage] = usePersistentState<Language>(StorageKeys.LANGUAGE, LANGUAGE_CONFIG.DEFAULT);
  const [locale, setLocale] = usePersistentState<Locale>(StorageKeys.LOCALE, LOCALE_CONFIG.DEFAULT);
  const [theme, setTheme] = usePersistentState<Theme>(StorageKeys.THEME, THEME_CONFIG.DEFAULT);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(Theme.LIGHT, Theme.DARK);

    if (theme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? Theme.DARK
        : Theme.LIGHT;

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const html = window.document.documentElement;
    html.lang = language;

    i18n.changeLanguage(language);
  }, [language]);

  const value = {
    theme,
    setTheme,
    importStrategy,
    setImportStrategy,
    language,
    setLanguage,
    locale,
    setLocale
  };

  return (
    <AppSettingsProviderContext value={value}>
      {children}
    </AppSettingsProviderContext>
  );
}

export function useAppSettings ()  {
  const context = useContext(AppSettingsProviderContext);

  if (context === undefined)
    throw new Error("useAppSettings must be used within a AppSettingsProvider");

  return context;
}
