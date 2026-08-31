export interface CatalogMethod {
  label: string;
  value: string;
  docs?: string;
  invoke: (...args: any[]) => any;
}

export interface CatalogModule {
  value: string;
  items: CatalogMethod[];
}

export type Catalog = CatalogModule[];

export function createCatalogMethod(
  moduleKey: string,
  methodKey: string,
  invokeFn: (...args: any[]) => any,
  docsUrl?: string
): CatalogMethod {
  return {
    label: methodKey,
    value: `${moduleKey}.${methodKey}`,
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
