import {
  type LucideIcon,
  MonitorDot,
  MoonStar,
  Sun
} from "lucide-react";
import { Theme } from "@/configs";

export const ThemeIcons: Record<Theme, LucideIcon> = {
  [Theme.LIGHT]: Sun,
  [Theme.DARK]: MoonStar,
  [Theme.SYSTEM]: MonitorDot,
} as const;
