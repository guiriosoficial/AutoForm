import { Catalogs, type Locale } from "@/configs";
import { createFakerCatalog, createFakerInstance } from "@/lib/catalog/providers/faker";
import { createBox4DevCatalog, getBox4DevInstance } from "@/lib/catalog/providers/box-4-dev";
import { createCustomCatalog } from "@/lib/catalog/providers/custom";
import type { CatalogMethod, CatalogModule } from "@/lib/catalog";

export function getCatalogFactories(customMethods: CatalogMethod[]): Record<Catalogs, (localeCode: Locale) => CatalogModule[]> {
  return {
    [Catalogs.FAKER]: createFakerCatalog,
    [Catalogs.BOX_4_DEV]: createBox4DevCatalog,
    [Catalogs.CUSTOM]: () => createCustomCatalog(customMethods),
  }
}

export function getCatalogInstances(locale: Locale): Record<Exclude<Catalogs, "custom">, object> {
  return {
    [Catalogs.FAKER]: createFakerInstance(locale),
    [Catalogs.BOX_4_DEV]: getBox4DevInstance(),
  }
}
