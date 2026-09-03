import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { createNextSequencedName } from "@/lib/string";
import { createFakerCatalog } from "@/lib/catalog/providers/faker";
import { createBox4DevCatalog } from "@/lib/catalog/providers/box4Dev";
import { isFunction } from "@/lib/guards";
import {
  createCatalogMethod,
  createCatalogModule,
  createCatalogCustomFunction,
  newCustomMethodOption,
  type CatalogMethod,
} from "@/lib/catalog";
import { CATALOG_CONFIG, StorageKeys } from "@/configs";

export function useCatalog() {
  const [customMethods, setCustomMethods] = usePersistentState<CatalogMethod[]>(StorageKeys.CUSTOM_METHODS, []);

  const { t } = useTranslation();

  const { locale } = useAppSettings();

  const customCatalog = useMemo(() => createCatalogModule(
    CATALOG_CONFIG.CUSTOM_MODULE_NAME,
    [...customMethods, newCustomMethodOption]
  ), [customMethods])

  const catalogOptions = useMemo(() => [
    ...createFakerCatalog(locale),
    ...createBox4DevCatalog(),
    customCatalog
  ], [locale, customMethods]);

  const catalogMethodsByKey = useMemo(() => {
    return new Map(
      catalogOptions
        .flatMap(group => group.items)
        .map((method) => [method.key, method])
    );
  }, [catalogOptions]);

  const customMethodsByKey = useMemo(() => {
    return new Map(
      customMethods
        .map((method) => [method.key, method])
    );
  }, [customMethods]);

  const createCustomMethod = useCallback(() => {
    const defaultName = t("configs.catalog.method.defaultName")
    const nextCatalogName = createNextSequencedName<CatalogMethod>(
      customMethods,
      "label",
      defaultName,
      { spaced: true }
    )
    const newMethod = createCatalogMethod(
      CATALOG_CONFIG.CUSTOM_MODULE_NAME,
      nextCatalogName,
      () => {},
      {
        code: createCatalogCustomFunction(),
        generateUniqueId: true
      }
    )

    setCustomMethods((prev) =>
      [...prev, newMethod]
    )

    return newMethod;
  }, [customMethods]);

  const updateCustomMethod = useCallback((
    methodKey: string,
    updater: Partial<CatalogMethod> | ((method: CatalogMethod) => Partial<CatalogMethod>)
  ) => {
    setCustomMethods((prev) =>
      prev.map(method => {
        if (method.key !== methodKey) return method;

        const updated =
          isFunction(updater)
            ? updater(method)
            : updater;

        return {
          ...method,
          ...updated,
        };
      })
    )
  }, [setCustomMethods])

  const removeCustomMethod = useCallback((methodKey: string) => {
    setCustomMethods((prev) =>
      prev.filter(method => method.key !== methodKey)
    )
  }, [setCustomMethods])

  return {
    customMethods,
    catalogOptions,
    catalogMethodsByKey,
    customMethodsByKey,
    createCustomMethod,
    updateCustomMethod,
    removeCustomMethod
  };
}