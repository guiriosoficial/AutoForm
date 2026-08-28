import { ArrowLeft, Heart, Settings2, type LucideIcon } from "lucide-react";

export const Page = {
  SPONSOR: "https://github.com/sponsors/guiriosoficial?frequency=one-time&sponsor=guiriosoficial",
  HOME: "home",
  PREFERENCES: "preferences",
} as const;

export type Page = (typeof Page)[keyof typeof Page];

export const PageIcons: Record<Page, LucideIcon> = {
  [Page.SPONSOR]: Heart,
  [Page.HOME]: ArrowLeft,
  [Page.PREFERENCES]: Settings2,
} as const;

export const PAGE_CONFIG = {
  DEFAULT: Page.HOME,
} as const;

