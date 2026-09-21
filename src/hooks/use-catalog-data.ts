import { type Dispatch, type SetStateAction, useCallback, useMemo } from "react";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { createFakerCatalog } from "@/lib/catalog/providers/faker";
import { createBox4DevCatalog } from "@/lib/catalog/providers/box-4-dev";
import {
  type CatalogMethod,
  type CatalogModule,
  createCatalogCustomFunction,
  createCatalogMethod,
  createCatalogModule,
  newCustomMethodOption,
} from "@/lib/catalog";
import {
  APP_URL,
  CATALOG_CONFIG,
  StorageKeys,
  Catalogs,
  type Locale,
} from "@/configs";
import { createNextSequencedName, isFunction } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { Preset } from "@/lib/presets.ts";

export interface CatalogData {
  catalogOptions: CatalogModule[];
  catalogMethodsByKey: Map<string, CatalogMethod>;
  customMethodsByKey: Map<string, CatalogMethod>;
  customMethods: CatalogMethod[];
  setCustomMethods: Dispatch<SetStateAction<CatalogMethod[]>>;
  createCustomMethod: () => CatalogMethod;
  updateCustomMethod: (
    methodKey: string,
    updater: Partial<CatalogMethod> | ((method: CatalogMethod) => Partial<CatalogMethod>)
  ) => void;
  removeCustomMethod: (methodKey: string) => void;
  getMethodUsageCount: (methodKey: string | undefined) => { presetsUseCount: number, fieldsUseCount: number } | undefined;
  isDuplicatedMethodName: (label: string, methodKey: string | undefined) => boolean;
}

interface UseCatalogDataArgs {
  presets: Preset[]
  detachGeneratorFromPresets: (key: string) => void;
}

export function useCatalogData({
  presets,
  detachGeneratorFromPresets
}: UseCatalogDataArgs) {
  const [customMethods, setCustomMethods] =
    usePersistentState<CatalogMethod[]>(StorageKeys.CUSTOM_METHODS, []);

  const { t } = useTranslation();

  const { locale, availableCatalogs } = useAppSettings();

  const customCatalog = useMemo(() => createCatalogModule(
    CATALOG_CONFIG.CUSTOM_MODULE_NAME,
    [...customMethods, newCustomMethodOption],
  ), [customMethods]);

  const catalogFactories: Record<Catalogs, (locale: Locale) => CatalogModule[]> = useMemo(() => ({
    [Catalogs.FAKER]: createFakerCatalog,
    [Catalogs.BOX_4_DEV]: createBox4DevCatalog,
    [Catalogs.CUSTOM]: () => [customCatalog],
  }), [customCatalog])

  const catalogOptions = useMemo(
    () => Object.entries(catalogFactories)
      .filter(([key]) => availableCatalogs.includes(key as Catalogs))
      .flatMap(([, factory]) => factory(locale)),
    [catalogFactories, availableCatalogs, locale]
  );

  const catalogMethodsByKey = useMemo(() => new Map(
    Object.entries(catalogFactories)
      .flatMap(([, factory]) => factory(locale))
      .flatMap(group => group.items)
      .map((method) => [method.key, method])
  ), [catalogFactories, locale]);

  const customMethodsByKey = useMemo(() => new Map(
    customMethods
      .map((method) => [method.key, method])
  ), [customMethods]);

  const createCustomMethod = useCallback(() => {
    const defaultName = t("configs.catalog.method.defaultName");
    const nextCatalogName = createNextSequencedName<CatalogMethod>(
      customMethods,
      "name",
      defaultName,
    );
    const newCustomMethodOptions = {
      code: createCatalogCustomFunction(),
      generateUniqueId: true,
      docUrl: `${APP_URL}/wiki/Custom-Methods`
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

    detachGeneratorFromPresets(methodKey);
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

  const isDuplicatedMethodName = useCallback((name: string, methodKey: string | undefined) => (
    customMethods.some((method) => method.name === name && method.key !== methodKey)
  ), [customMethods]);

  return {
    catalogOptions,
    catalogMethodsByKey,
    customMethodsByKey,
    customMethods,
    setCustomMethods,
    createCustomMethod,
    updateCustomMethod,
    removeCustomMethod,
    getMethodUsageCount,
    isDuplicatedMethodName,
  }
}

