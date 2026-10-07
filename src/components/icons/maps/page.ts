import { type LucideIcon, ArrowLeft, Heart, Settings2, BookOpen } from "lucide-react";
import { Page } from "@/configs";

export const PageIcons: Record<Page, LucideIcon> = {
  [Page.SPONSOR]: Heart,
  [Page.WIKI]: BookOpen,
  [Page.HOME]: ArrowLeft,
  [Page.PREFERENCES]: Settings2,
} as const;
