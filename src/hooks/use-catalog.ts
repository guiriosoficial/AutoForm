import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { getNewListItemNumber } from "@/lib/utils";
import { createFakerCatalog } from "@/lib/catalog/faker";
import { createBox4DevCatalog } from "@/lib/catalog/box-4-dev";
import {
  createCatalogMethod,
  createCatalogModule,
  type CatalogMethod
} from "@/lib/catalog";
import { CATALOG_CONFIG, StorageKeys } from "@/configs";

export function useCatalog() {
  const [customMethods, setCustomMethods] = usePersistentState<CatalogMethod[]>(StorageKeys.CUSTOM_METHODS, []);

  const { t } = useTranslation();

  const { locale } = useAppSettings();

  const customCatalog = useMemo(() => [createCatalogModule(CATALOG_CONFIG.CUSTOM_MODULE_NAME, customMethods)], [customMethods])

  const catalogOptions = useMemo(() => [
    ...createFakerCatalog(locale),
    ...createBox4DevCatalog(),
    ...customCatalog
  ], [locale, customCatalog]);

  const catalogMethodsByKey = useMemo(() => {
    return new Map(
      catalogOptions
        .flatMap(group => group.items)
        .map((method) => [method.value, method])
    );
  }, [catalogOptions]);

  const createCustomMethod = useCallback(() => {
    const defaultName = t("configs.catalog.method.defaultName")
    const nextCatalogNumber = getNewListItemNumber<CatalogMethod>(customMethods, "label", defaultName)
    const newMethod = createCatalogMethod(
      CATALOG_CONFIG.CUSTOM_MODULE_NAME,
      `${CATALOG_CONFIG.CUSTOM_MODULE_NAME}.${defaultName}${nextCatalogNumber}`,
      () => {}
    )

    setCustomMethods((prev) =>
      [...prev, newMethod]
    )
  }, [setCustomMethods]);

  const updateCustomMethod = useCallback((updatedMethod: CatalogMethod) => {
    setCustomMethods((prev) =>
      prev.map(method => {
        if (method.value !== updatedMethod.value) return method;

        return updatedMethod
      })
    )
  }, [setCustomMethods])

  const removeCustomMethod = useCallback((methodKey: string) => {
    setCustomMethods((prev) =>
      prev.filter(method => method.value !== methodKey)
    )
  }, [setCustomMethods])

  return {
    catalogOptions,
    catalogMethodsByKey,
    createCustomMethod,
    updateCustomMethod,
    removeCustomMethod
  };
}