import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";
import { Navigation } from "@/components/layouts/Navigation";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="flex flex-col items-center gap-1 mb-2 mt-4">
      <Navigation />

      <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <Zap className="text-primary" />
        {t("globals.appTitle")}
      </h1>

      <p className="text-sm text-muted-foreground">
        {t("globals.appDescription")}
      </p>
    </header>
  )
}
