import { Page, Theme } from "@/configs";
import { ArrowLeft, MonitorDot, MoonStar, Settings2, Sun, Heart, type LucideIcon } from "lucide-react";

export const PageIcons: Record<Page, LucideIcon> = {
  [Page.SPONSOR]: Heart,
  [Page.HOME]: ArrowLeft,
  [Page.PREFERENCES]: Settings2,
} as const;

export const ThemeIcons: Record<Theme, LucideIcon> = {
  [Theme.LIGHT]: Sun,
  [Theme.DARK]: MoonStar,
  [Theme.SYSTEM]: MonitorDot
} as const;
