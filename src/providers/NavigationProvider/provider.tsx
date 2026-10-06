import { type ReactNode, useMemo, useState } from "react";
import { type Page, PAGE_CONFIG } from "@/configs";
import { NavigationProviderContext } from "@/providers/NavigationProvider/context";

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({
  children,
}: NavigationProviderProps) {
  const [activePage, setActivePage] = useState<Page>(PAGE_CONFIG.DEFAULT);

  const contextValue = useMemo(() => ({
    activePage,
    setActivePage,
  }), [activePage]);

  return (
    <NavigationProviderContext value={contextValue}>
      {children}
    </NavigationProviderContext>
  );
}

