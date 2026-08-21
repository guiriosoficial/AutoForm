import { useTranslation } from "react-i18next";
import { Copy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterProps {
  showCopyButton: boolean;
  generateValues: () => void;
  copyFormAsJSON: () => void;
}

export function Footer({
  showCopyButton,
  generateValues,
  copyFormAsJSON
}: FooterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <Button
        className="flex-1"
        onClick={generateValues}
      >
        <Zap />
        {t("footer.buttons.generateData")}
      </Button>

      {showCopyButton && (
        <Button
          variant="outline"
          className="px-6"
          onClick={copyFormAsJSON}
        >
          <Copy />
          {t("footer.buttons.copyAsJson")}
        </Button>
      )}
    </div>
  )
}