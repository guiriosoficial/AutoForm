import i18n from "@/i18n";

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

export const getCatalogMethodDefaultName = () => {
  return i18n.t("configs.catalog.method.defaultName");
};

export const getPresetDefaultNameRegex = () => {
  const baseName = getCatalogMethodDefaultName();
  const escapedName = baseName.replaceAll(/[^\w\s]/gu, "\\$&");
  return new RegExp(`^${escapedName} (\\d+)$`);
};

export function getNewCatalogMethodNumber(method: CatalogMethod[]) {
  return method.reduce((max, method) => {
    const regex = getPresetDefaultNameRegex();
    const match = method.label.match(regex)

    if (!match) return max;

    return Math.max(max, Number(match[1]));
  }, 0);
}
