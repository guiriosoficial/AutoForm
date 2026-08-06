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

const createCatalogMethodObject = (category: string, method: string) => ({
    label: method,
    value: `${category}.${method}`,
    docs: createDocsUrl(category, method),
})

export const FakerCatalog = Object.entries(faker)
    .filter(([, value]) => isFakerModule(value))
    .map(([moduleKey, moduleValue]) => ({
        category: moduleKey,
        methods: Object.entries(moduleValue)
            .filter(([methodKey, methodValue]) => isFakerMethod(methodKey, methodValue))
            .map(([methodKey]) => createCatalogMethodObject(moduleKey, methodKey)),
    }));

export type Catalog = typeof FakerCatalog[number];
export type CatalogMethod = Catalog["methods"][number];
export type CatalogCategory = Catalog["category"];

export const CATALOG_METHODS = FakerCatalog.flatMap(group => group.methods);
export const CATALOG_METHODS_BY_VALUE = Object.fromEntries(
  CATALOG_METHODS.map(method => [method.value, method])
);