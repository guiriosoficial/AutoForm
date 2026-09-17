import { useTranslation } from "react-i18next";
import { type ReactNode, createContext, useContext, useMemo, useCallback } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { createFakerCatalog } from "@/lib/catalog/providers/faker";
import { createBox4DevCatalog } from "@/lib/catalog/providers/box-4-dev";
import { createNextSequencedName, isFunction } from "@/lib/utils";
import {
  type CatalogMethod,
  type CatalogModule,
  createCatalogCustomFunction,
  createCatalogMethod,
  createCatalogModule,
  newCustomMethodOption,
} from "@/lib/catalog";
import {
  StorageKeys,
  CATALOG_CONFIG,
} from "@/configs";
import type { Preset } from "@/lib/presets";

interface CatalogProviderProps {
  children: ReactNode;
  presets: Preset[];
  onRemoveCustomMethod: (key: string) => void;
}

interface CatalogProviderState {
  customMethods: CatalogMethod[];
  catalogOptions: CatalogModule[];
  catalogMethodsByKey: Map<string, CatalogMethod>;
  customMethodsByKey: Map<string, CatalogMethod>;
  createCustomMethod: () => CatalogMethod;
  updateCustomMethod: (
    methodKey: string,
    updater: Partial<CatalogMethod> | ((method: CatalogMethod) => Partial<CatalogMethod>)
  ) => void;
  removeCustomMethod: (key: string) => void;
  getMethodUsageCount: (key: string | undefined) => { presetsUseCount: number, fieldsUseCount: number } | undefined;
  isDuplicatedLabel: (label: string, methodKey: string | undefined) => boolean;
}

const initialState: CatalogProviderState = {
  catalogOptions: [],
  catalogMethodsByKey: new Map(),
  customMethods: [],
  customMethodsByKey: new Map(),
  createCustomMethod: () => ({} as CatalogMethod),
  updateCustomMethod: () => {},
  removeCustomMethod: () => {},
  getMethodUsageCount: () => ({ fieldsUseCount: 0, presetsUseCount: 0 }),
  isDuplicatedLabel: () => false,
};

export const CatalogProviderContext =
  createContext<CatalogProviderState>(initialState);

export function CatalogProvider({
  children,
  presets,
  onRemoveCustomMethod,
}: CatalogProviderProps) {
  const [customMethods, setCustomMethods] =
    usePersistentState<CatalogMethod[]>(StorageKeys.CUSTOM_METHODS, []);

  const { t } = useTranslation();

  const { locale } = useAppSettings();

  const customCatalog = useMemo(() => createCatalogModule(
    CATALOG_CONFIG.CUSTOM_MODULE_NAME,
    [...customMethods, newCustomMethodOption],
  ), [customMethods]);

  const catalogOptions = useMemo(() => [
    ...createFakerCatalog(locale),
    ...createBox4DevCatalog(),
    customCatalog,
  ], [locale, customCatalog]);

  const catalogMethodsByKey = useMemo(() => new Map(
    catalogOptions
      .flatMap(group => group.items)
      .map((method) => [method.key, method])
  ), [catalogOptions]);

  const customMethodsByKey = useMemo(() => new Map(
    customMethods
      .map((method) => [method.key, method])
  ), [customMethods]);

  const createCustomMethod = useCallback(() => {
    const defaultName = t("configs.catalog.method.defaultName");
    const nextCatalogName = createNextSequencedName<CatalogMethod>(
      customMethods,
      "label",
      defaultName,
    );
    const newCustomMethodOptions = {
      code: createCatalogCustomFunction(),
      generateUniqueId: true,
    };
    const newMethod = createCatalogMethod(
      CATALOG_CONFIG.CUSTOM_MODULE_NAME,
      nextCatalogName,
      undefined,
      newCustomMethodOptions,
    );

    setCustomMethods((prev) => [...prev, newMethod]);

    return newMethod;
  }, [customMethods, t]);

  const updateCustomMethod = useCallback((
    methodKey: string,
    updater: Partial<CatalogMethod> | ((method: CatalogMethod) => Partial<CatalogMethod>),
  ) => {
    setCustomMethods((prev) =>
      prev.map((method) => {
        if (method.key !== methodKey) return method;

        const updated = isFunction(updater)
          ? updater(method)
          : updater;

        return {
          ...method,
          ...updated,
        };
      }),
    );
  }, [setCustomMethods]);

  const removeCustomMethod = useCallback((methodKey: string) => {
    setCustomMethods((prev) =>
      prev.filter(method => method.key !== methodKey)
    );

    onRemoveCustomMethod(methodKey);
  }, [setCustomMethods]);

  const getMethodUsageCount = useCallback((methodKey: string | undefined) => {
      let fieldsUseCount = 0;
      let presetsUseCount = 0;

      if (!methodKey || !presets) return

      for (const preset of presets) {
        let fieldsInPreset = 0;

        for (const field of preset.fields) {
          if (field.generator === methodKey) {
            fieldsInPreset += 1;
          }
        }

        if (fieldsInPreset > 0) {
          fieldsUseCount += fieldsInPreset;
          presetsUseCount += 1;
        }
      }

      return { fieldsUseCount, presetsUseCount };
    }, [presets]);

  const isDuplicatedLabel = useCallback((label: string, methodKey: string | undefined) => (
    customMethods.some((method) => method.label === label && method.key !== methodKey)
  ), [customMethods]);

  const value = useMemo(() => ({
    customMethods,
    catalogOptions,
    catalogMethodsByKey,
    customMethodsByKey,
    createCustomMethod,
    updateCustomMethod,
    removeCustomMethod,
    getMethodUsageCount,
    isDuplicatedLabel,
  }), [
    customMethods,
    catalogOptions,
    catalogMethodsByKey,
    customMethodsByKey,
    createCustomMethod,
    updateCustomMethod,
    removeCustomMethod,
    getMethodUsageCount,
    isDuplicatedLabel
  ])

  return (
    <CatalogProviderContext value={value}>
      {children}
    </CatalogProviderContext>
  );
}

export function useCatalog() {
  const context = useContext(CatalogProviderContext);

  if (context === undefined) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }

  return context;
}
