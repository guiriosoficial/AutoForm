import { CATALOG_CONFIG } from "@/configs";

export interface CatalogMethod {
  label: string;
  key: string;
  docs?: string;
  invoke: (...args: any[]) => any;
}

export interface CatalogModule {
  value: string;
  items: CatalogMethod[];
}

export const newCustomMethodOption = createCatalogMethod(
  CATALOG_CONFIG.CUSTOM_MODULE_NAME,
  CATALOG_CONFIG.CUSTOM_NEW_METHOD_NAME,
  () => {}
);

export function createCatalogMethod(
  moduleKey: string,
  methodKey: string,
  invokeFn: (...args: any[]) => any,
  docsUrl?: string
): CatalogMethod {
  return {
    label: methodKey,
    key: `${moduleKey}.${methodKey}`,
    invoke: invokeFn,
    docs: docsUrl,
  };
}

export function createCatalogModule(
  moduleKey: string,
  items: CatalogMethod[]
): CatalogModule {
  return {
    value: moduleKey,
    items,
  };
}
