import { createContext } from "react";
import type { CatalogData } from "@/hooks/use-catalog-data";

type CatalogProviderState = CatalogData;

export const CatalogProviderContext =
  createContext<CatalogProviderState | undefined>(undefined);
