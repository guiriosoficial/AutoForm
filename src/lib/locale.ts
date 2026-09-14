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

export function toLocaleTag(locale: string): string {
  const specialTag = SPECIAL_LOCALES[locale as SpecialLocaleKey];

  if (specialTag) return specialTag;

  return locale.replaceAll("_", "-");
}

export function getLocaleFlagEmoji(locale: string): string {
  try {
    const { region } = new Intl.Locale(toLocaleTag(locale)).maximize();
    return region?.length === LOCALE_REGION_LENGTH
      ? String.fromCodePoint(...[...region].map((char) => char.codePointAt(0)! + REGIONAL_OFFSET))
      : "";
  } catch {
    return "";
  }
}

export function createLocaleDisplayNames(currentLanguage: string): Intl.DisplayNames | null {
  try {
    return new Intl.DisplayNames([toLocaleTag(currentLanguage)], { type: "language" });
  } catch {
    return null;
  }
}

export function getLocaleDisplayName(
  locale: string,
  displayNames: Intl.DisplayNames | null,
): string {
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

  return flag ? `${flag} ${name}` : name;
}
