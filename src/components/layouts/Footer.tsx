import { Trans } from "react-i18next";
import { Button, buttonVariants } from "@/components/ui/button";
import { APP_AUTHOR_URL } from "@/configs";
import type { LucideIcon } from "lucide-react";

interface FooterProps {
  primaryButonText: string;
  primaryButtonIcon?: LucideIcon;
  onPrimaryButtonClick: () => void;
  secondaryButtonText?: string;
  secondaryButtonIcon?: LucideIcon;
  onSecondaryButtonClick?: () => void;
  hideSecondaryButton?: boolean;
  hideCredits?: boolean;
}

const creditsTranslationComponents = {
  author: (
    <a
      href={APP_AUTHOR_URL}
      target="_blank"
      rel="noreferrer"
      className={buttonVariants({ variant: "link" })}
    />
  )
}

export function Footer({
  primaryButonText,
  primaryButtonIcon: PrimaryButtonIcon,
  onPrimaryButtonClick,
  secondaryButtonText,
  secondaryButtonIcon: SecondaryButtonIcon,
  onSecondaryButtonClick,
  hideSecondaryButton,
  hideCredits
}: FooterProps) {
  const showSecondaryButton =
    !!onSecondaryButtonClick &&
    !!secondaryButtonText &&
    !hideSecondaryButton;

  return (
    <>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={onPrimaryButtonClick}
        >
          {PrimaryButtonIcon && <PrimaryButtonIcon />}
          {primaryButonText}
        </Button>

        {showSecondaryButton && (
          <Button
            variant="outline"
            className="px-6"
            onClick={onSecondaryButtonClick}
          >
            {SecondaryButtonIcon && <SecondaryButtonIcon />}
            {secondaryButtonText}
          </Button>
        )}
      </div>

      {!hideCredits && (
        <span className="text-sm text-center text-muted-foreground">
          <Trans
            i18nKey="globals.credits"
            components={creditsTranslationComponents}
          />
        </span>
      )}
    </>
  )
}