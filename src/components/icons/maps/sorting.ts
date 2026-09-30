import { PresetSorting } from "@/configs";
import { type LucideIcon, ClockArrowUp, ClockArrowDown, ArrowDownAZ, ArrowUpZA } from "lucide-react";

export const PresetSortingIcons: Record<PresetSorting, LucideIcon> = {
  [PresetSorting.NAME_ASC]: ArrowDownAZ,
  [PresetSorting.NAME_DESC]: ArrowUpZA,
  [PresetSorting.CREATED_AT_ASC]: ClockArrowDown,
  [PresetSorting.CREATED_AT_DESC]: ClockArrowUp,
} as const;
