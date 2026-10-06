import i18n from "@/i18n";
import { type ReactNode, useEffect, useMemo } from "react";
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
import { AppSettingsProviderContext } from "@/providers/AppSettingsProvider/context.tsx";

interface AppSettingsProviderProps {
  children: ReactNode;
}

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
  ]);

  return (
    <AppSettingsProviderContext value={contextValue}>
      {children}
    </AppSettingsProviderContext>
  );
}
