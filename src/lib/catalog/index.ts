import { isArray, isObject, isOptionalString, isPopulatedString, isTimestamp } from "@/lib/utils";
import { CATALOG_CONFIG } from "@/configs";
import type { GeneratorValue } from "@/lib/generator";

export interface CatalogMethod {
  key: `${string}.${string}`;
  createdAt?: number;
  name: string;
  docs?: string;
  code?: string;
  invoke?: (...args: unknown[]) => GeneratorValue;
}

export interface CatalogModule {
  value: string;
  items: CatalogMethod[];
}

export function createCatalogMethod(
  moduleKey: string,
  methodKey: string,
  invokeFn?: (...args: unknown[]) => GeneratorValue,
  options?: {
    code?: string;
    docsUrl?: string;
    generateUniqueId?: boolean;
  },
): CatalogMethod {
  const uniqueKey = options?.generateUniqueId
    ? crypto.randomUUID()
    : methodKey;
  const createdAt = uniqueKey
    ? Date.now()
    : undefined;

  return {
    name: methodKey,
    key: `${moduleKey}.${uniqueKey}`,
    invoke: invokeFn,
    docs: options?.docsUrl,
    code: options?.code,
    createdAt,
  };
}

export function createCatalogModule(
  moduleKey: string,
  items: CatalogMethod[],
): CatalogModule {
  return {
    value: moduleKey,
    items,
  };
}

// TODO: Doc method with comments
export function createCatalogCustomFunction() {
  return `\
(name = "John Doe") => {
  return "Hello " + faker.person.firstName()
}`;
}

export function isValidCustomMethod(value: unknown): value is CatalogMethod {
  if (!isObject(value)) return false;

  return (
    isPopulatedString(value.name) &&
    isPopulatedString(value.key) &&
    isPopulatedString(value.code) &&
    isOptionalString(value.docs) &&
    isTimestamp(value.createdAt) &&
    value.key.startsWith(`${CATALOG_CONFIG.CUSTOM_MODULE_NAME}.`)
  );
}

export function isValidCustomMethodArray(value: unknown): value is CatalogMethod[] {
  return (
    isArray(value) &&
    value.every((item) => isValidCustomMethod(item))
  );
}

export const newCustomMethodOption = createCatalogMethod(
  CATALOG_CONFIG.CUSTOM_MODULE_NAME,
  CATALOG_CONFIG.CUSTOM_NEW_METHOD_NAME,
);
