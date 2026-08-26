import { faker } from "@faker-js/faker";
import { isFunction, isObject } from "@/lib/guards";
import {Catalog, createCatalogMethod, createCatalogModule} from "@/lib/catalog";

type FakerMethodFn = (...args: any[]) => any;
type FakerModuleObject = Record<string, FakerMethodFn>;
type FakerInstance = Record<string, FakerModuleObject>

const isFakerModule = (value: unknown): value is Record<string, unknown> =>
  isObject(value) && "faker" in value;

const isFakerMethod = (key: string, value: unknown): value is (...args: any[]) => any =>
  isFunction(value) && key !== "faker" && !key.startsWith("_");

const createFakerDocsUrl = (category: string, method: string): string =>
  `https://fakerjs.dev/api/${category}.html#${method}`;

const getFakerModules = () =>
  Object.entries(faker as unknown as FakerInstance).filter(([, moduleValue]) =>
    isFakerModule(moduleValue)
  );

const getFakerModuleMethods = (module: FakerModuleObject)  =>
  Object.entries(module).filter(([methodKey, methodValue]) =>
    isFakerMethod(methodKey, methodValue)
  );

export const fakerCatalog: Catalog = getFakerModules()
  .map(([moduleKey, moduleValue]) => createCatalogModule(
    moduleKey,
    getFakerModuleMethods(moduleValue)
      .map(([methodKey, methodValue]) => createCatalogMethod(
        moduleKey,
        methodKey,
        methodValue.bind(moduleValue),
        createFakerDocsUrl(moduleKey, methodKey)
      ))
  ))
