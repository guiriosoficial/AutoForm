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
        onClick={generateValues}
        className="flex-1"
      >
        <Zap />
        {t("button_generate_data")}
      </Button>

      {showCopyButton && (
        <Button
          onClick={copyFormAsJSON}
          variant="outline"
        >
          <Copy />
          {t("button_copy_as_json")}
        </Button>
      )}
    </div>
  )
}