const REGIONAL_OFFSET = 0x1F1E6 - 65;

const SPECIAL_LOCALES = {
  ku_ckb: "ckb",
  ku_kmr_latin: "ku-Latn",
  mn_MN_cyrl: "mn-Cyrl-MN",
} as const;

type SpecialLocaleKey = keyof typeof SPECIAL_LOCALES;

export function toLocaleTag(locale: string): string {
  const specialTag = SPECIAL_LOCALES[locale as SpecialLocaleKey];

  if (specialTag) return specialTag;

  return locale.replace(/_/gu, "-");
}

export function getLocaleFlagEmoji(locale: string): string {
  try {
    const region = new Intl.Locale(toLocaleTag(locale)).maximize().region;
    return region?.length === 2
      ? String.fromCodePoint(...[...region].map((c) => c.charCodeAt(0) + REGIONAL_OFFSET))
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
  displayNames: Intl.DisplayNames | null
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