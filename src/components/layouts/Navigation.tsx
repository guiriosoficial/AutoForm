import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useNavigation } from "@/providers/NavigationProvider";
import { Page } from "@/configs";
import { PageIcons } from "@/configs/maps";

export function Navigation() {
  const {
    activePage,
    setActivePage
  } = useNavigation()

  const navigationItems = useMemo(() =>
    Object.values(Page).filter((page) => page !== activePage),
    [activePage]
  )

  return (
    <div className="absolute top-2 right-2 text-muted-foreground">
      {navigationItems.map((page) => (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setActivePage(page)}
        >
          <DynamicIcon icon={PageIcons[page]} />
        </Button>
      ))}
    </div>
  )
}