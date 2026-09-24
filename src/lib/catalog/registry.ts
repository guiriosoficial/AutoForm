import { Catalogs, type Locale } from "@/configs";
import { createFakerCatalog, createFakerInstance } from "@/lib/catalog/providers/faker.ts";
import { createBox4DevCatalog, getBox4DevInstance } from "@/lib/catalog/providers/box-4-dev.ts";
import {
  createCustomCatalog,
  createCustomMethodsInstance,
} from "@/lib/catalog/providers/custom.ts";
import type { CatalogMethod, CatalogModule } from "@/lib/catalog/index.ts";

export function getCatalogFactories(customMethods: CatalogMethod[]): Record<Catalogs, (localeCode: Locale) => CatalogModule[]> {
  return {
    [Catalogs.FAKER]: createFakerCatalog,
    [Catalogs.BOX_4_DEV]: createBox4DevCatalog,
    [Catalogs.CUSTOM]: () => createCustomCatalog(customMethods),
  }
}

export function getCatalogInstances(locale: Locale, customMethods: CatalogMethod[]): Record<Catalogs, object> {
  return {
    [Catalogs.BOX_4_DEV]: getBox4DevInstance(),
    [Catalogs.FAKER]: createFakerInstance(locale),
    [Catalogs.CUSTOM]: createCustomMethodsInstance(customMethods),
  }
}