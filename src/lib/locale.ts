// const SPECIAL_LOCALE_REGIONS: Record<string, string> = {
//   ku: "iq",
//   ku_ckb: "iq",
//   ku_cmr_latin: "tr",
//   eo: "",
// };

const REGIONAL_OFFSET = 0x1F1E6 - 65;

// const SPECIAL_LOCALES = {
//   ku_Ckb: "",
//   ku_Kmr_Latin: "",
//   mn_MN_cyrl: "",
// } as const;

export function toLocaleTag(locale: string): string {
  return locale.replace(/_/g, "-");
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