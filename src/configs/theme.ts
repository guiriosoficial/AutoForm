import { MonitorDot, MoonStar, Sun, type LucideIcon } from "lucide-react";

export const Theme = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system"
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const ThemeIcons: Record<Theme, LucideIcon> = {
  [Theme.LIGHT]: Sun,
  [Theme.DARK]: MoonStar,
  [Theme.SYSTEM]: MonitorDot
} as const;

export const THEME_CONFIG = {
  DEFAULT: Theme.SYSTEM
};
