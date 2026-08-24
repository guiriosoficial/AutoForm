import { useContext } from "react";
import { AppSettingsProviderContext } from "@/providers/AppSettingsProvider.tsx";

export function useAppSettings ()  {
  const context = useContext(AppSettingsProviderContext)

  if (context === undefined)
    throw new Error("useAppSettings must be used within a AppSettingsProvider")

  return context
}
