import { ReactNode } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ButtonGroup } from "@/components/ui/button-group";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import type { LucideIcon } from "lucide-react";

interface ToggleOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: LucideIcon;
}

interface AppToggleGroupProps<T extends string> {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
}

export function AppToggleGroup<T extends string>({
  value,
  onChange,
  options,
}: AppToggleGroupProps<T>) {
  const handleValueChange = (newValue: string[]) => {
    if (newValue.length === 0) return

    onChange(newValue[0] as T);
  };

  return (
    <ToggleGroup
      value={[value]}
      variant="outline"
      onValueChange={handleValueChange}
    >
      <ButtonGroup>
        {options.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
          >
            <DynamicIcon icon={opt.icon} />
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ButtonGroup>
    </ToggleGroup>
  );
}