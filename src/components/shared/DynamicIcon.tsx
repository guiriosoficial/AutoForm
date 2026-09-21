import type { LucideIcon } from "lucide-react";
import type { IconSize } from "@/configs";

interface DynamicIconProps {
  icon: LucideIcon | undefined;
  size?: IconSize;
  className?: string;
}

export function DynamicIcon({
  icon: Icon,
  size,
  className,
}: DynamicIconProps) {
  return Icon ? (
    <Icon
      size={size}
      className={className}
    />
  ) : null;
}
