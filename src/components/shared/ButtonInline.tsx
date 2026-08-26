import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { MouseEventHandler } from "react";

interface ButtonInlineProps {
  icon: LucideIcon
  size?: number
  persistent?: boolean
  destructive?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function ButtonInline({
  icon: Icon,
  size = 14,
  persistent,
  destructive,
  className,
  onClick,
}: ButtonInlineProps) {
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