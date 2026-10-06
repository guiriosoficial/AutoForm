import { createContext } from "react";
import { type Page, PAGE_CONFIG } from "@/configs";

interface NavigationProviderState {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const initialState: NavigationProviderState = {
  activePage: PAGE_CONFIG.DEFAULT,
  setActivePage: () => {},
};

export const NavigationProviderContext = createContext<NavigationProviderState>(initialState);
