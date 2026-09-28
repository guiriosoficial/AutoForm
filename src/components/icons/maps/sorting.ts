import { PresetSorting } from "@/configs";
import { type LucideIcon, ArrowUpNarrowWide, ArrowDownNarrowWide, ArrowDownLeftFromCircle } from "lucide-react";

export const PresetSortingIcons: Record<PresetSorting, LucideIcon> = {
  [PresetSorting.ASC]: ArrowUpNarrowWide,
  [PresetSorting.DESC]: ArrowDownNarrowWide,
  [PresetSorting.CHRONOLOGICAL]: ArrowDownLeftFromCircle,
} as const;