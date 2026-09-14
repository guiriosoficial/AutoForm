import type { LucideIcon } from "lucide-react";

interface DynamicIconProps {
  icon: LucideIcon | undefined;
  size?: number;
  className?: string;
}

export function DynamicIcon({
  icon: Icon,
  size,
  className,
}: DynamicIconProps) {
  return Icon
    ? (
      <Icon
        size={size}
        className={className}
      />
    )
    : null;
}
