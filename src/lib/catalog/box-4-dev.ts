import { gerar } from "@box4dev/gerador-br"
import { isFunction } from "@/lib/guards";
import { toTitleCase } from "@/lib/utils";
import { createCatalogMethod, createCatalogModule } from "@/lib/catalog/index";

type Box4DevMethod = (...args: never[]) => unknown;
type Box4DevModuleObject = Record<string, Box4DevMethod>;
type Box4DevInstance = Record<string, Box4DevMethod | Box4DevModuleObject>;
type Box4DevEntry = [string, Box4DevMethod];

const moduleName = 'gerador-br';

// TODO: Get dynamic language
const createBox4DevDocUrl = (method: string) =>
  `https://box4.dev/en/pacotes-npm/gerador-br/docs#${method}`

const getBox4DevMethods = () =>
  Object.entries(gerar as unknown as Box4DevInstance)
    .flatMap(([key, value]): Box4DevEntry[] => {
      if (isFunction(value)) return [[key, value]];

      return Object.entries(value)
        .filter(([nestedKey]) => !nestedKey.endsWith("Obj") && nestedKey !== "aleatoria")
        .map(([nestedKey, nestedValue]) => [
          `${key}${toTitleCase(nestedKey)}`,
          nestedValue,
          ]);
    })

export const createBox4DevCatalog = () => [
  createCatalogModule(
    moduleName,
    getBox4DevMethods().map(([methodKey, methodValue]) =>
      createCatalogMethod(
        moduleName,
        methodKey,
        methodValue.bind(methodValue),
        createBox4DevDocUrl(methodKey)
      )
    )
  )
]