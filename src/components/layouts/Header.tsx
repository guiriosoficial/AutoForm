import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";
import { Button }  from "@/components/ui/button";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useNavigation } from "@/providers/NavigationProvider";
import { Page, PageIcons } from "@/configs";

export function Header() {
  const { activePage, setActivePage } = useNavigation();
  const { t } = useTranslation();

  // TODO: Verificar este useMemo
  const navigationItems = useMemo(
    () => Object.values(Page).filter((page) => page !== activePage),
    [activePage]
  );

  const handleNavigate = (nextPage: Page) => {
    if (nextPage.startsWith("https")) {
      window.open(nextPage, "_blank", "noreferrer");
      return;
    }

    setActivePage(nextPage);
  };

  return (
    <header className="flex flex-col items-center gap-1 mb-2 mt-4">
      <div className="absolute top-2 right-2 text-muted-foreground">
        {navigationItems.map((page) => (
          <Button
            key={page}
            size="icon"
            variant="ghost"
            onClick={() => handleNavigate(page)}
          >
            <DynamicIcon icon={PageIcons[page]} />
          </Button>
        ))}
      </div>

      <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <Zap className="text-primary" />
        {t("globals.appTitle")}
      </h1>

      <p className="text-sm text-muted-foreground">
        {t("globals.appDescription")}
      </p>
    </header>
  );
}
