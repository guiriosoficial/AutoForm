import { useContext } from "react";
import { NavigationProviderContext } from "@/providers/NavigationProvider/context";

export function useNavigation() {
  const context = useContext(NavigationProviderContext);

  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
}
