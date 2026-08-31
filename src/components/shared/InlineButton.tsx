import { cn } from "@/lib/utils";
import type { MouseEventHandler } from "react";
import type { LucideIcon } from "lucide-react";

interface InlineButtonProps {
  icon: LucideIcon;
  size?: number;
  persistent?: boolean;
  destructive?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function InlineButton({
  icon: Icon,
  size = 14,
  persistent,
  destructive,
  className,
  onClick
}: InlineButtonProps) {
  const buttonClasses = cn(
    "text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all",
    destructive && "hover:text-destructive",
    persistent && "opacity-100",
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
    >
      <Icon size={size} />
    </button>
  )
}