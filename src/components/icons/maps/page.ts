import { type LucideIcon, ArrowLeft, Heart, Settings2 } from "lucide-react";
import { Page } from "@/configs";

export const PageIcons: Record<Page, LucideIcon> = {
  [Page.SPONSOR]: Heart,
  [Page.HOME]: ArrowLeft,
  [Page.PREFERENCES]: Settings2
} as const;
