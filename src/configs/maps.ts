import {Page, Theme, ImportStrategy} from "@/configs";
import {ArrowLeft, MonitorDot, MoonStar, Settings2, Sun, type LucideIcon} from "lucide-react";
import i18n from "@/i18n"

const { t } = i18n

export const PageIcons: Record<Page, LucideIcon> = {
  [Page.HOME]: ArrowLeft,
  [Page.PREFERENCES]: Settings2
} as const;

export const ThemeIcons: Record<Theme, LucideIcon> = {
  [Theme.LIGHT]: Sun,
  [Theme.DARK]: MoonStar,
  [Theme.SYSTEM]: MonitorDot
} as const;

export const getThemeOptions = () => Object.values(Theme).map((theme: Theme) => ({
  value: theme,
  label: t(`configs.theme.${theme}`),
  icon: ThemeIcons[theme]
}))

export const getImportStrategyOptions = () => Object.values(ImportStrategy).map((strategy: ImportStrategy) => ({
  value: strategy,
  label: t(`configs.importStrategy.${strategy}.title`),
}))
