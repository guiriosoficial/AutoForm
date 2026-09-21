import { cn } from "@/lib/utils";
import { type IconSize, ICON_CONFIG } from "@/configs";
import type { MouseEventHandler } from "react";
import type { LucideIcon } from "lucide-react";

interface InlineButtonProps {
  icon: LucideIcon;
  size?: IconSize;
  persistent?: boolean;
  destructive?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function InlineButton({
  icon: Icon,
  size = ICON_CONFIG.DEFAULT_SIZE,
  persistent,
  destructive,
  className,
  onClick,
}: InlineButtonProps) {
  const buttonClasses = cn(
    "text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all",
    destructive && "hover:text-destructive",
    persistent && "opacity-100",
    className,
  );

  return (
    <button
      className={buttonClasses}
      type="button"
      onClick={onClick}
    >
      <Icon size={size} />
    </button>
  );
}
