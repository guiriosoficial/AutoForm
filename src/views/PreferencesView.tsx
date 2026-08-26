import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/layouts/Footer";
import { AppToggleGroup } from "@/components/shared/ToggleGroup";
import { LocaleSelect } from "@/components/shared/LocaleSelect";
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
import { useNavigation } from "@/providers/NavigationProvider";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { preventDefaultEscape } from "@/lib/events"
import {
  Page,
  Language,
  Locale,
} from "@/configs";
import {
  getThemeOptions,
  getImportStrategyOptions
} from "@/configs/maps";

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
            <AppToggleGroup
              value={theme}
              options={getThemeOptions()}
              onChange={setTheme}
            />
          </Field>

          <Field>
            <FieldLabel>
              {t("preferencesManager.form.importStrategyToggle.label")}
            </FieldLabel>
            <AppToggleGroup
              value={importStrategy}
              options={getImportStrategyOptions()}
              onChange={setImportStrategy}
            />
            <FieldDescription>
              {t(`configs.importStrategy.${importStrategy}.description`)}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>
              {t("preferencesManager.form.localeSelect.label")}
            </FieldLabel>
            <LocaleSelect
              value={locale}
              items={Object.values(Locale)}
              onValueChange={setLocale}
              placeholder={t("preferencesManager.form.localeSelect.placeholder")}
              emptyStateText={t("preferencesManager.form.localeSelect.empty")}
            />
          </Field>

          <Field>
            <FieldLabel>
              {t("preferencesManager.form.languageSelect.label")}
            </FieldLabel>
            <LocaleSelect
              value={language}
              items={Object.values(Language)}
              onValueChange={setLanguage}
              placeholder={t("preferencesManager.form.languageSelect.placeholder")}
              emptyStateText={t("preferencesManager.form.languageSelect.empty")}
            />
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
