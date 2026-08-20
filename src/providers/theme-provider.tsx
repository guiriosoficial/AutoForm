import { createContext, useEffect, type ReactNode } from "react"
import { usePersistentState } from "@/hooks/use-persistent-state";
import { StorageKeys, Theme } from "@/configs";

interface ThemeProviderProps {
  children: ReactNode
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: Theme.SYSTEM,
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = usePersistentState(StorageKeys.THEME, Theme.SYSTEM)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(Theme.LIGHT, Theme.DARK)

    if (theme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext  value={value}>
      {children}
    </ThemeProviderContext>
  )
}
