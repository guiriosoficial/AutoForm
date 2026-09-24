import { type CatalogMethod, createCatalogModule, newCustomMethodOption } from "@/lib/catalog";
import { CATALOG_CONFIG } from "@/configs";

export function createCustomCatalog(customMethods: CatalogMethod[]) {
  return [createCatalogModule(
    CATALOG_CONFIG.CUSTOM_MODULE_NAME,
    [...customMethods, newCustomMethodOption]
  )]
}

export function createCustomMethodsInstance(customMethods: CatalogMethod[]) {
  return Object.fromEntries(customMethods.map(method => [method.name, method.code]))
}
