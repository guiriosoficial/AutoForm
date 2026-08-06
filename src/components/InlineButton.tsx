import type { LucideIcon } from "lucide-react";

interface InlineButtonProps {
  icon: LucideIcon
  size?: number
  title?: string
  onClick?: () => void
}

export function InlineButton({
  icon: Icon,
  size = 12,
  title,
  onClick,
}: InlineButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className="shrink-0 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
    >
      <Icon size={size} />
    </button>
  )
}