import { type ReactNode, createContext, useContext, useMemo, useState } from "react";
import { type Page, PAGE_CONFIG } from "@/configs";

interface NavigationProviderProps {
  children: ReactNode;
}

interface NavigationProviderState {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const initialState: NavigationProviderState = {
  activePage: PAGE_CONFIG.DEFAULT,
  setActivePage: () => {},
};

export const NavigationProviderContext = createContext<NavigationProviderState>(initialState);

export function NavigationProvider({
  children,
}: NavigationProviderProps) {
  const [activePage, setActivePage] = useState<Page>(PAGE_CONFIG.DEFAULT);

  const value = useMemo(() => ({
    activePage,
    setActivePage,
  }), [activePage]);

  return (
    <NavigationProviderContext value={value}>
      {children}
    </NavigationProviderContext>
  );
}

export function useNavigation() {
  const context = useContext(NavigationProviderContext);

  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
}
