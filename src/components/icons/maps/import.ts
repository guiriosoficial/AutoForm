import {
  type LucideIcon,
  MessageCircleQuestion,
  RefreshCw,
  RotateCw,
  SquaresUnite,
} from "lucide-react";
import { ImportStrategy } from "@/configs";

export const ImportStrategyIcons: Record<ImportStrategy, LucideIcon> = {
  [ImportStrategy.APPEND]: SquaresUnite,
  [ImportStrategy.OVERWRITE]: RefreshCw,
  [ImportStrategy.REPLACE_ALL]: RotateCw,
  [ImportStrategy.ALWAYS_ASK]: MessageCircleQuestion,
};
