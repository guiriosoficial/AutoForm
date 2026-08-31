import { Faker, allLocales } from "@faker-js/faker";
import { isFunction, isObject } from "@/lib/guards";
import { createCatalogMethod, createCatalogModule, type Catalog } from "@/lib/catalog";
import { Locale, LOCALE_CONFIG } from "@/configs";

type FakerMethodFn = (...args: never[]) => unknown;
type FakerModuleObject = Record<string, FakerMethodFn>;
type FakerInstance = Record<string, FakerModuleObject>;

const isFakerModule = (value: unknown): value is Record<string, unknown> =>
  isObject(value) && "faker" in value;

const isFakerMethod = (key: string, value: unknown): value is FakerMethodFn =>
  isFunction(value) && key !== "faker" && !key.startsWith("_");

const createFakerDocUrl = (category: string, method: string) =>
  `https://fakerjs.dev/api/${category}.html#${method}`;

const getFakerModules = (fakerInstance: Faker) =>
  Object.entries(fakerInstance as unknown as FakerInstance)
    .filter(([, moduleValue]) => isFakerModule(moduleValue));

const getFakerModuleMethods = (module: FakerModuleObject) =>
  Object.entries(module)
    .filter(([methodKey, methodValue]) => isFakerMethod(methodKey, methodValue));

export function createFakerCatalog(locale: Locale): Catalog {
  const fakerInstance = new Faker({
    locale: [allLocales[locale], allLocales[LOCALE_CONFIG.DEFAULT]]
  })

  const modules = getFakerModules(fakerInstance);

  return modules.map(([moduleKey, moduleValue]) =>
    createCatalogModule(
      moduleKey,
      getFakerModuleMethods(moduleValue)
        .map(([methodKey, methodValue]) =>
          createCatalogMethod(
            moduleKey,
            methodKey,
            methodValue.bind(moduleValue),
            createFakerDocUrl(moduleKey, methodKey)
          )
        )
    )
  );
}