import { CatalogProviderContext } from "@/providers/CatalogProvider/context";
import type { CatalogData } from "@/hooks/use-catalog-data";
import type { ReactNode } from "react";

interface CatalogProviderProps {
  children: ReactNode;
  catalogData: CatalogData;
}

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
