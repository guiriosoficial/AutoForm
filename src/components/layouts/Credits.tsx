import { Trans } from "react-i18next";
import { buttonVariants } from "@/components/ui/button";
import { APP_AUTHOR_URL } from "@/configs"

export function Credits() {
  return (
    <span className="text-sm text-center text-muted-foreground">
      <Trans
        i18nKey="globals.credits"
        components={{
          author: (
            <a
              href={APP_AUTHOR_URL}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "link" })}
            />
          )
        }}
      />
    </span>
  )
}
