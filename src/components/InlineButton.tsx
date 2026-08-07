import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {MouseEventHandler} from "react";

interface InlineButtonProps {
  icon: LucideIcon
  size?: number
  title?: string
  persistent?: boolean
  className?: string
  onClick?: () => MouseEventHandler<HTMLButtonElement>
}

export function InlineButton({
  icon: Icon,
  size = 12,
  title,
  persistent,
  className,
  onClick,
}: InlineButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={cn("shrink-0 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all", persistent && "opacity-100", className)}
    >
      <Icon size={size} />
    </button>
  )
}