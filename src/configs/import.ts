import { MessageCircleQuestion, RefreshCw, RotateCw, SquaresUnite, type LucideIcon } from "lucide-react";

export const ImportStrategy = {
  APPEND: "append",
  OVERWRITE: "overwrite",
  REPLACE_ALL: "replaceAll",
  ALWAYS_ASK: "alwaysAsk",
} as const;

export type ImportStrategy = (typeof ImportStrategy)[keyof typeof ImportStrategy];

export const ImportStrategyIcons: Record<ImportStrategy, LucideIcon> = {
  [ImportStrategy.APPEND]: SquaresUnite,
  [ImportStrategy.OVERWRITE]: RefreshCw,
  [ImportStrategy.REPLACE_ALL]: RotateCw,
  [ImportStrategy.ALWAYS_ASK]: MessageCircleQuestion,
};

export const IMPORT_CONFIG = {
  FILE_TYPE: "application/json",
  REPLACE_ALL_THRESHOLD: 1,
  STRATEGY_DEFAULT: ImportStrategy.ALWAYS_ASK,
  ASKED_STRATEGY_DEFAULT: ImportStrategy.APPEND,
} as const;
