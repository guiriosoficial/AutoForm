import { useTranslation } from "react-i18next";
import { Sun, MoonStar, MonitorDot, Settings2 } from "lucide-react"
import {Button, buttonVariants} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { ButtonGroup } from "@/components/ui/button-group";
import { ImportStrategy, Locale, LocaleLanguage, Theme } from "@/configs";
import { cn, preventDefaultEscape } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox.tsx";
import { useAppSettings } from "@/hooks/use-app-settings.ts";

interface ConfigurationsDialogProps {
 className: string
}

const ThemeIcon = {
  [Theme.LIGHT]: <Sun />,
  [Theme.DARK]: <MoonStar />,
  [Theme.SYSTEM]: <MonitorDot />
}

export function ConfigurationsDialog({
   className
}: ConfigurationsDialogProps) {
  const { t } = useTranslation()

  const {
    theme,
    setTheme,
    importStrategy,
    setImportStrategy,
    locale,
    setLocale,
    language,
    setLanguage
  } = useAppSettings()

  const handleChangeImportStrategy = (strategy: string[]) => {
    if (strategy.length === 0) return

    setImportStrategy(strategy[0] as ImportStrategy)
  }

  const handleChangeTheme = (theme: string[]) => {
    if (theme.length === 0) return

    setTheme(theme[0] as Theme)
  }

  const handleChangeLocale = (locale: string | null) => {
    if (!locale) return

    setLocale(locale as Locale)
  }

  const handleChangeLanguage = (language: string | null) => {
    if (!language) return

    setLanguage(language as LocaleLanguage)
  }


  const displayNames = new Intl.DisplayNames([language.replace("_", "-")], {
    type: "language",
  });

  function getLocaleDisplayName(locale: string) {
    try {
      const localeTag = locale.replace("_", "-");

      const flag = getFlagEmoji(locale);

      return `${flag} ${displayNames.of(localeTag) ?? locale}`;
    } catch {
      return locale;
    }
  }

  function getFlagEmoji(locale: string) {
    try {
      const region = new Intl.Locale(
        locale.replace("_", "-")
      ).maximize().region;

      if (!region) return "";

      return [...region]
        .map(char =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
        .join("");
    } catch {
      return "";
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
        <Button variant="ghost" size="icon">
          <Settings2 />
        </Button>
        }
        className={className}
      />
      <DialogContent
        className="max-h-11/12 overflow-y-auto"
        onKeyDown={preventDefaultEscape}
      >
        <DialogHeader>
          <DialogTitle>
            {t("presetsManager.dialogs.importPreset.title")}
          </DialogTitle>
          <DialogDescription>
            {""}
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel>
            {t("presetsManager.dialogs.importPreset.form.strategyToggle.label")}
          </FieldLabel>
          <ToggleGroup
            value={[theme]}
            variant="outline"
            onValueChange={handleChangeTheme}
          >
            <ButtonGroup>
              {Object.values(Theme).map((value) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                >
                  {ThemeIcon[value]}
                  {t(`configs.themes.${value}`)}
                </ToggleGroupItem>
              ))}
            </ButtonGroup>
          </ToggleGroup>
        </Field>

        <Field>
          <FieldLabel>
            {t("presetsManager.dialogs.importPreset.form.strategyToggle.label")}
          </FieldLabel>
          <ToggleGroup
            value={[importStrategy]}
            variant="outline"
            onValueChange={handleChangeImportStrategy}
          >
            <ButtonGroup>
              {Object.values(ImportStrategy).map((value) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                >
                  {t(`configs.importStrategy.${value}.title`)}
                </ToggleGroupItem>
              ))}
            </ButtonGroup>
          </ToggleGroup>
          <FieldDescription>
            {t(`configs.importStrategy.${importStrategy}.description`)}
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel>
            Locale
          </FieldLabel>
          <Combobox
            value={locale}
            items={Object.values(Locale)}
            itemToStringLabel={getLocaleDisplayName}
            onValueChange={handleChangeLocale}
          >
            <ComboboxInput
              className="flex-1 capitalize"
              placeholder={t("config.localeSelect.placeholder")}
              onKeyDown={preventDefaultEscape}
            />
            <ComboboxContent>
              <ComboboxEmpty>
                {t("config.localeSelect.empty")}
              </ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item}
                    value={item}
                    className="capitalize"
                  >
                    {getLocaleDisplayName(item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        <Field>
          <FieldLabel>
            Language
          </FieldLabel>
          <Combobox
            value={language}
            items={Object.values(LocaleLanguage)}
            itemToStringLabel={getLocaleDisplayName}
            onValueChange={handleChangeLanguage}
          >
            <ComboboxInput
              className="flex-1 capitalize"
              placeholder={t("config.languageSelect.placeholder")}
              onKeyDown={preventDefaultEscape}
            />
            <ComboboxContent>
              <ComboboxEmpty>
                {t("config.languageSelect.empty")}
              </ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    key={item}
                    value={item}
                    className="capitalize"
                  >
                    {getLocaleDisplayName(item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>








        <DialogFooter className="justify-center">
          Made with ♥ by
          <a
            href="http://github.com"
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "link" }), "flex-none!")}
          >
            guiriosoficial
          </a>
          {/*<DialogClose*/}
          {/*  render={*/}
          {/*    <Button variant="outline">*/}
          {/*      {t("presetsManager.dialogs.importPreset.cancelButton")}*/}
          {/*    </Button>*/}
          {/*  }*/}
          {/*/>*/}
          {/*<Button onClick={() => {}}>*/}
          {/*  {t("presetsManager.dialogs.importPreset.confirmButton")}*/}
          {/*</Button>*/}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
