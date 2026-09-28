import i18n from "@/i18n";
import { type ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { updateSandboxLocale } from "@/lib/sandbox";
import {
  LOCALE_CONFIG,
  LANGUAGE_CONFIG,
  THEME_CONFIG,
  PRESET_CONFIG,
  IMPORT_CONFIG,
  CATALOG_CONFIG,
  EDITOR_CONFIG,
  StorageKeys,
  Theme,
  type ImportStrategy,
  type Locale,
  type Language,
  type Catalogs,
  type PresetSorting,
} from "@/configs";

interface AppSettingsProviderProps {
  children: ReactNode;
}

interface AppSettingsProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  importStrategy: ImportStrategy;
  setImportStrategy: (strategy: ImportStrategy) => void;
  availableCatalogs: Catalogs[];
  setAvailableCatalogs: (catalogs: Catalogs[]) => void;
  presetsSorting: PresetSorting;
  setPresetsSorting: (sorting: PresetSorting) => void;
  autoFormat: boolean;
  setAutoFormat: (autoFormat: boolean) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

const initialState: AppSettingsProviderState = {
  theme: THEME_CONFIG.DEFAULT,
  setTheme: () => {},
  importStrategy: IMPORT_CONFIG.STRATEGY_DEFAULT,
  setImportStrategy: () => {},
  availableCatalogs: CATALOG_CONFIG.DEFAULT_AVAILABLE,
  setAvailableCatalogs: () => {},
  presetsSorting: PRESET_CONFIG.DEFAULT_SORTING,
  setPresetsSorting: () => {},
  autoFormat: EDITOR_CONFIG.DEFAULT_AUTO_FORMAT,
  setAutoFormat: () => {},
  locale: LOCALE_CONFIG.DEFAULT,
  setLocale: () => {},
  language: LANGUAGE_CONFIG.DEFAULT,
  setLanguage: () => {},
};

export const AppSettingsProviderContext =
  createContext<AppSettingsProviderState>(initialState);

export function AppSettingsProvider({
  children,
}: AppSettingsProviderProps) {
  const [theme, setTheme] = usePersistentState<Theme>(
    StorageKeys.THEME,
    THEME_CONFIG.DEFAULT,
  );
  const [importStrategy, setImportStrategy] = usePersistentState<ImportStrategy>(
    StorageKeys.IMPORT_STRATEGY,
    IMPORT_CONFIG.STRATEGY_DEFAULT,
  );
  const [availableCatalogs, setAvailableCatalogs] = usePersistentState<Catalogs[]>(
    StorageKeys.AVAILABLE_CATALOGS,
    CATALOG_CONFIG.DEFAULT_AVAILABLE,
  );
  const [presetsSorting, setPresetsSorting] = usePersistentState<PresetSorting>(
    StorageKeys.PRESETS_SORTING,
    PRESET_CONFIG.DEFAULT_SORTING
  );
  const [autoFormat, setAutoFormat] = usePersistentState<boolean>(
    StorageKeys.AUTO_FORMAT,
    EDITOR_CONFIG.DEFAULT_AUTO_FORMAT,
  );
  const [language, setLanguage] = usePersistentState<Language>(
    StorageKeys.LANGUAGE,
    LANGUAGE_CONFIG.DEFAULT,
  );
  const [locale, setLocale] = usePersistentState<Locale>(
    StorageKeys.LOCALE,
    LOCALE_CONFIG.DEFAULT,
  );

  useEffect(() => {
    const root = globalThis.document.documentElement;

    root.classList.remove(Theme.LIGHT, Theme.DARK);

    if (theme === Theme.SYSTEM) {
      const systemTheme = globalThis.matchMedia(`(prefers-color-scheme: ${Theme.DARK})`).matches
        ? Theme.DARK
        : Theme.LIGHT;

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const html = globalThis.document.documentElement;
    html.lang = language;

    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    updateSandboxLocale(locale)
  }, [locale]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    importStrategy,
    setImportStrategy,
    availableCatalogs,
    setAvailableCatalogs,
    presetsSorting,
    setPresetsSorting,
    autoFormat,
    setAutoFormat,
    language,
    setLanguage,
    locale,
    setLocale,
  }), [
    theme,
    importStrategy,
    availableCatalogs,
    presetsSorting,
    autoFormat,
    language,
    locale,
  ]);

  return (
    <AppSettingsProviderContext value={contextValue}>
      {children}
    </AppSettingsProviderContext>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsProviderContext);

  if (context === undefined) {
    throw new Error("useAppSettings must be used within a AppSettingsProvider");
  }

  return context;
}
