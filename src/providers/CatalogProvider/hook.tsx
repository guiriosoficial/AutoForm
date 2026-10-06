import { useContext } from "react";
import { CatalogProviderContext } from "@/providers/CatalogProvider/context";

export function useCatalog() {
  const context = useContext(CatalogProviderContext);

  if (context === undefined) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }

  return context;
}
