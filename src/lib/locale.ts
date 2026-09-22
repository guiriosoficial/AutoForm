// oxlint-disable typescript/no-non-null-assertion

const LOCALE_REGION_LENGTH = 2;
const REGIONAL_INDICATOR_A = 0x1_F1_E6;
const LATIN_CAPITAL_A = "A".codePointAt(0)!;
const REGIONAL_OFFSET = REGIONAL_INDICATOR_A - LATIN_CAPITAL_A;

const SPECIAL_LOCALES = {
  ku_ckb: "ckb",
  ku_kmr_latin: "ku-Latn",
  mn_MN_cyrl: "mn-Cyrl-MN",
} as const;

type SpecialLocaleKey = keyof typeof SPECIAL_LOCALES;

function toLocaleTag(locale: string): string {
  const specialTag = SPECIAL_LOCALES[locale as SpecialLocaleKey];

  if (specialTag) return specialTag;

  return locale.replaceAll("_", "-");
}

function getLocaleFlagEmoji(locale: string): string {
  try {
    const { region } = new Intl.Locale(toLocaleTag(locale)).maximize();
    return region?.length === LOCALE_REGION_LENGTH
      ? String.fromCodePoint(...[...region].map((char) => char.codePointAt(0)! + REGIONAL_OFFSET))
      : "";
  } catch {
    return "";
  }
}

function createLocaleDisplayNames(currentLanguage: string): Intl.DisplayNames | undefined {
  try {
    return new Intl.DisplayNames([toLocaleTag(currentLanguage)], { type: "language" });
  } catch {
    // TODO: Catch error
  }
}

export function getLocaleDisplayNamesMap(
  currentLanguage: string,
  locales: string[],
): Map<string, string> {
  const map = new Map<string, string>();
  const displayNames = createLocaleDisplayNames(currentLanguage);

  for (const locale of locales) {
    const tag = toLocaleTag(locale);
    const flag = getLocaleFlagEmoji(locale);

    let name = tag;
    if (displayNames) {
      try {
        name = displayNames.of(tag) ?? tag;
      } catch {
        name = tag;
      }
    }

    map.set(locale, flag ? `${flag} ${name}` : name);
  }

  return map;
}
