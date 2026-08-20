import { faker } from "@faker-js/faker";

const isFakerModule = (value: unknown) =>
  typeof value === "object" &&
  value !== null &&
  "faker" in value

const isFakerMethod= (key: string, value: unknown) =>
  typeof value === "function" &&
  key !== "faker"

const createDocsUrl = (category: string, method: string) =>
  `https://fakerjs.dev/api/${category}.html#${method}`;

const createCatalogMethodObject = (category: string, method: string, methodValue: unknown) => ({
    label: method,
    value: `${category}.${method}`,
    docs: createDocsUrl(category, method),
    invoke: methodValue
})

export const AutoFormCatalog = Object.entries(faker)
    .filter(([, value]) => isFakerModule(value))
    .map(([moduleKey, moduleValue]) => ({
        value: moduleKey,
        items: Object.entries(moduleValue)
            .filter(([methodKey, methodValue]) => isFakerMethod(methodKey, methodValue))
            .map(([methodKey, methodValue]) => createCatalogMethodObject(moduleKey, methodKey, methodValue)),
    }));

export type CatalogModule = typeof AutoFormCatalog[number];
export type CatalogMethod = CatalogModule["items"][number];
export type MainCatalog = CatalogModule["value"];

export const CATALOG_METHODS = AutoFormCatalog.flatMap(group => group.items);
export const CATALOG_METHODS_BY_VALUE = Object.fromEntries(
  CATALOG_METHODS.map(method => [method.value, method])
);