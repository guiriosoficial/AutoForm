import { createContext } from "react";

import {
  LOCALE_CONFIG,
  LANGUAGE_CONFIG,
  THEME_CONFIG,
  PRESET_CONFIG,
  IMPORT_CONFIG,
  CATALOG_CONFIG,
  EDITOR_CONFIG,
  type Theme,
  type ImportStrategy,
  type Locale,
  type Language,
  type Catalogs,
  type PresetSorting,
} from "@/configs";

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
