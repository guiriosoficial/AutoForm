import { type ReactNode, createContext, useContext } from "react";
import type { CatalogData } from "@/hooks/use-catalog-data.ts";

interface CatalogProviderProps {
  children: ReactNode;
  catalogData: CatalogData,
}

type CatalogProviderState = CatalogData

export const CatalogProviderContext =
  createContext<CatalogProviderState | undefined>(undefined);

export function CatalogProvider({
  children,
  catalogData,
}: CatalogProviderProps) {
  return (
    <CatalogProviderContext value={catalogData}>
      {children}
    </CatalogProviderContext>
  );
}

export function useCatalog() {
  const context = useContext(CatalogProviderContext);

  if (context === undefined) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }

  return context;
}
