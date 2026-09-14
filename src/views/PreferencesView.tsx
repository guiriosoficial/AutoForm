import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layouts/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ButtonGroup } from "@/components/ui/button-group";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { ImportStrategyIcons, ThemeIcons } from "@/components/icons/maps";
import { useNavigation } from "@/providers/NavigationProvider";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { createLocaleDisplayNames, getLocaleDisplayName } from "@/lib/locale";
import { preventDefaultEscape } from "@/lib/dom";
import { ImportStrategy, Language, Locale, Page, Theme } from "@/configs";

export function PreferencesView() {
  const { t, i18n } = useTranslation();

  const { setActivePage } = useNavigation();

  const {
    theme,
    setTheme,
    importStrategy,
    setImportStrategy,
    locale,
    setLocale,
    language,
    setLanguage,
  } = useAppSettings();

  const displayNames = useMemo(() => createLocaleDisplayNames(i18n.language), [i18n.language]);

  const localeDisplayName = (itemLocale: string) => getLocaleDisplayName(itemLocale, displayNames);

  const handleChangeImportStrategy = (newStrategy: string[]) => {
    if (newStrategy.length === 0) return;

    setImportStrategy(newStrategy[0] as ImportStrategy);
  };

  const handleChangeTheme = (newTheme: string[]) => {
    if (newTheme.length === 0) return;

    setTheme(newTheme[0] as Theme);
  };

  const handleChangeLocale = (newLocale: string | null) => {
    if (!newLocale) return;

    setLocale(newLocale as Locale);
  };

  const handleChangeLanguage = (newLanguage: string | null) => {
    if (!newLanguage) return;

    setLanguage(newLanguage as Language);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {t("preferencesManager.title")}
          </CardTitle>
        </CardHeader>

        <CardContent onKeyDown={preventDefaultEscape}>
          <FieldGroup>

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
                  {Object.values(Theme).map((itemTheme) => (
                    <ToggleGroupItem
                      key={itemTheme}
                      value={itemTheme}
                    >
                      <DynamicIcon icon={ThemeIcons[itemTheme]} />
                      {t(`configs.theme.${itemTheme}`)}
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
                  {Object.values(ImportStrategy).map((itemStrategy) => (
                    <ToggleGroupItem
                      key={itemStrategy}
                      value={itemStrategy}
                    >
                      <DynamicIcon icon={ImportStrategyIcons[itemStrategy]} />
                      {t(`configs.importStrategy.${itemStrategy}.title`)}
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
                    {(itemLocale) => (
                      <ComboboxItem
                        key={itemLocale}
                        value={itemLocale}
                        className="capitalize"
                      >
                        {localeDisplayName(itemLocale)}
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
                    {(itemLanguage) => (
                      <ComboboxItem
                        key={itemLanguage}
                        value={itemLanguage}
                        className="capitalize"
                      >
                        {localeDisplayName(itemLanguage)}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Footer
        primaryButonText={t("preferencesManager.confirmButton")}
        primaryButtonIcon={ArrowLeft}
        onPrimaryButtonClick={() => setActivePage(Page.HOME)}
      />
    </>
  );
}
