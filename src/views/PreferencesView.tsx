import i18n from "@/i18n"
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/layouts/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
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
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { useNavigation } from "@/providers/NavigationProvider";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { preventDefaultEscape } from "@/lib/events"
import {
  Page,
  Language,
  Locale,
  Theme,
  ImportStrategy,
} from "@/configs";
import { ThemeIcons } from "@/configs/maps";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox";
import {
  createLocaleDisplayNames,
  getLocaleDisplayName
} from "@/lib/locale";

export function PreferencesView() {
  const { t } = useTranslation()

  const { setActivePage } = useNavigation()

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

    setLanguage(language as Language)
  }

  const displayNames = useMemo(
    () => createLocaleDisplayNames(i18n.language),
    [i18n.language]
  )

  const localeDisplayName = useCallback(
    (locale: string) => getLocaleDisplayName(locale, displayNames),
    [displayNames]
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {t("preferencesManager.title")}
          </CardTitle>
          <CardDescription>
            {t("preferencesManager.description")}
          </CardDescription>
        </CardHeader>

        <CardContent onKeyDown={preventDefaultEscape}>
          <Field>
            <FieldLabel>
              {t("preferencesManager.form.themeToggle.label")}
            </FieldLabel>

            <ToggleGroup
              value={[theme]}
              variant="outline"
              onValueChange={handleChangeTheme}
            >
              <ButtonGroup>
                {Object.values(Theme).map((theme) => (
                  <ToggleGroupItem
                    key={theme}
                    value={theme}
                  >
                    <DynamicIcon icon={ThemeIcons[theme]} />
                    {t(`configs.theme.${theme}`)}
                  </ToggleGroupItem>
                ))}
              </ButtonGroup>
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel>
              {t("preferencesManager.form.importStrategyToggle.label")}
            </FieldLabel>
            <ToggleGroup
              value={[importStrategy]}
              variant="outline"
              onValueChange={handleChangeImportStrategy}
            >
              <ButtonGroup>
                {Object.values(ImportStrategy).map((strategy) => (
                  <ToggleGroupItem
                    key={strategy}
                    value={strategy}
                  >
                    {t(`configs.importStrategy.${strategy}.label`)}
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
              {t("preferencesManager.form.localeSelect.label")}
            </FieldLabel>
            <Combobox
              value={locale}
              items={Object.values(Locale)}
              itemToStringLabel={localeDisplayName}
              onValueChange={handleChangeLocale}
            >
              <ComboboxInput
                className="flex-1"
                placeholder={t("preferencesManager.form.localeSelect.placeholder")}
                onKeyDown={preventDefaultEscape}
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  {t("preferencesManager.form.localeSelect.empty")}
                </ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem
                      key={item}
                      value={item}
                      className="capitalize"
                    >
                      {localeDisplayName(item)}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field>
            <FieldLabel>
              {t("preferencesManager.form.languageSelect.label")}
            </FieldLabel>
            <Combobox
              value={language}
              items={Object.values(Language)}
              itemToStringLabel={localeDisplayName}
              onValueChange={handleChangeLanguage}
            >
              <ComboboxInput
                className="flex-1"
                placeholder={t("preferencesManager.form.languageSelect.placeholder")}
                onKeyDown={preventDefaultEscape}
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  {t("preferencesManager.form.languageSelect.empty")}
                </ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem
                      key={item}
                      value={item}
                      className="capitalize"
                    >
                      {localeDisplayName(item)}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

        </CardContent>
      </Card>

      <Footer
        primaryButonText={t("preferencesManager.confirmButton")}
        primaryButtonIcon={ArrowLeft}
        onPrimaryButtonClick={() => setActivePage(Page.HOME)}
      />
    </>
  )
}
