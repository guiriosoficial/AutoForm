import { Faker, allLocales } from "@faker-js/faker";
import { isFunction, isObject } from "@/lib/guards";
import { createCatalogMethod, createCatalogModule } from "@/lib/catalog";
import { LOCALE_CONFIG, type Locale } from "@/configs";
import type { GeneratorValue } from "@/lib/generator";

type FakerMethodFn = (...args: unknown[]) => GeneratorValue;
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

export const createFakerCatalog = (locale: Locale) => {
  const fakerInstance = new Faker({
    locale: [allLocales[locale], allLocales[LOCALE_CONFIG.DEFAULT]],
  });

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
            { docsUrl: createFakerDocUrl(moduleKey, methodKey) }
          )
        )
    )
  );
};
