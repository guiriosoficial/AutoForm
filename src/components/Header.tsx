import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="text-center space-y-1">
      <div className="flex items-center justify-center gap-2">
        <Zap
          className="text-primary"
          size={24}
        />
        <h1 className="text-xl font-bold text-foreground">
          {t("header.title")}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("header.description")}
      </p>
    </header>
  )
}
