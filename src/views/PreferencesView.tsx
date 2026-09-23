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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { ImportStrategyIcons, ThemeIcons } from "@/components/icons/maps";
import { useNavigation } from "@/providers/NavigationProvider";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { getLocaleDisplayNamesMap } from "@/lib/locale";
import { toTitleCase, preventDefaultEscape } from "@/lib/utils";
import { Catalogs, ImportStrategy, Language, Locale, Page, Theme } from "@/configs";

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
    autoFormat,
    setAutoFormat,
    availableCatalogs,
    setAvailableCatalogs,
  } = useAppSettings();

  const localeDisplayNamesMap = useMemo(() =>
    getLocaleDisplayNamesMap(i18n.language, Object.values(Locale)
  ), [i18n.language]);

  const getLocalizedDisplayName = (localeCode: string) => {
    const displayName = localeDisplayNamesMap.get(localeCode) ?? locale;

    return toTitleCase(displayName);
  };

  const handleThemeChange = (nextTheme: string[]) => {
    if (nextTheme.length === 0) return;

    setTheme(nextTheme[0] as Theme);
  };

  const handleImportStrategyChange = (nextStrategy: string[]) => {
    if (nextStrategy.length === 0) return;

    setImportStrategy(nextStrategy[0] as ImportStrategy);
  };

  const handleAvailableCatalogsChange = (nextCatalogs: string[]) => {
    setAvailableCatalogs(nextCatalogs as Catalogs[]);
  };

  const handleLocaleChange = (nextLocale: string | null) => {
    if (!nextLocale) return;

    setLocale(nextLocale as Locale);
  };

  const handleLanguageChange = (nextLanguage: string | null) => {
    if (!nextLanguage) return;

    setLanguage(nextLanguage as Language);
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
                onValueChange={handleThemeChange}
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
                onValueChange={handleImportStrategyChange}
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
                {t("preferencesManager.form.availableCatalogsMultiToggle.label")}
              </FieldLabel>
              <ToggleGroup
                value={availableCatalogs}
                multiple
                variant="outline"
                onValueChange={handleAvailableCatalogsChange}
              >
                {Object.values(Catalogs).map((itemCatalog) => (
                  <ToggleGroupItem
                    key={itemCatalog}
                    value={itemCatalog}
                  >
                    {toTitleCase(itemCatalog)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <Field>
              <FieldLabel>
                {t("preferencesManager.form.autoFormatSwitch.label")}
              </FieldLabel>
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-format-switch"
                  checked={autoFormat}
                  onCheckedChange={setAutoFormat}
                />
                <Label form="auto-format-switch">
                  {autoFormat
                    ? t("preferencesManager.form.autoFormatSwitch.enabledLabel")
                    : t("preferencesManager.form.autoFormatSwitch.disabledLabel")
                  }
                </Label>
              </div>
            </Field>

            <Field>
              <FieldLabel>
                {t("preferencesManager.form.localeSelect.label")}
              </FieldLabel>
              <Combobox
                value={locale}
                items={Object.values(Locale)}
                itemToStringLabel={getLocalizedDisplayName}
                onValueChange={handleLocaleChange}
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
                      >
                        {getLocalizedDisplayName(itemLocale)}
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
                itemToStringLabel={getLocalizedDisplayName}
                onValueChange={handleLanguageChange}
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
                      >
                        {getLocalizedDisplayName(itemLanguage)}
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
        primaryButtonText={t("preferencesManager.confirmButton")}
        primaryButtonIcon={ArrowLeft}
        onPrimaryButtonClick={() => setActivePage(Page.HOME)}
      />
    </>
  );
}
