import { CATALOG_CONFIG } from "@/configs";

export interface CatalogMethod {
  label: string;
  key: string;
  docs?: string;
  code?: string;
  invoke: (...args: never[]) => unknown;
}

export interface CatalogModule {
  value: string;
  items: CatalogMethod[];
}

export function createCatalogMethod(
  moduleKey: string,
  methodKey: string,
  invokeFn: (...args: never[]) => unknown,
  options?: {
    code?: string,
    docsUrl?: string
    generateUniqueId?: boolean
  }
): CatalogMethod {
  const uniqueKey = options?.generateUniqueId
    ? crypto.randomUUID()
    : methodKey;

  return {
    label: methodKey,
    key: `${moduleKey}.${uniqueKey}`,
    invoke: invokeFn,
    docs: options?.docsUrl,
    code: options?.code,
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

export function createCatalogCustomFunction() {
  return `
    (name = "Joh Doe") => {
      return "Hello " + name
    }
  `
}

export const newCustomMethodOption = createCatalogMethod(
  CATALOG_CONFIG.CUSTOM_MODULE_NAME,
  CATALOG_CONFIG.CUSTOM_NEW_METHOD_NAME,
  () => {}
);
