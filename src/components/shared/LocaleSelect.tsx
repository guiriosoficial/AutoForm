import { useMemo } from "react";
import { preventDefaultEscape } from "@/lib/events"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox";

const REGIONAL_INDICATOR_OFFSET = 127397;

/**
 * Mapeamento de exceções para locales sem país ISO direto (ex: idiomas regionais, planejados ou modificados)
 */
const SPECIAL_LOCALE_REGIONS: Record<string, string> = {
  ku: "iq",           // Curdo -> Mapeia para Iraque (onde o ckb/Sorâni é oficial)
  ku_ckb: "iq",
  ku_cmr_latin: "tr", // Kurmanji em latim -> Mapeia para Turquia
  eo: "",             // Esperanto -> Idioma construído, sem bandeira de país
};

interface ParsedLocale {
  baseTag: string;
  variant?: string;
  forcedRegion?: string;
}

export function parseFakerLocale(locale: string): ParsedLocale {
  // Trata exceções registradas manualmente antes
  console.log(locale)
  if (SPECIAL_LOCALE_REGIONS[locale] !== undefined) {
    const forcedRegion = SPECIAL_LOCALE_REGIONS[locale];
    const parts = locale.split("_");
    const variant = parts.length > 2 ? parts.pop() : undefined;
    return {
      baseTag: parts.slice(0, 2).join("-"),
      variant,
      forcedRegion,
    };
  }

  const parts = locale.split("_");

  if (parts.length > 2) {
    const variant = parts.pop();
    const baseTag = parts.join("-");
    return { baseTag, variant };
  }

  return {
    baseTag: parts.join("-"),
    variant: undefined,
  };
}

export function toLocaleTag(locale: string): string {
  return parseFakerLocale(locale).baseTag;
}

export function getFlagEmoji(locale: string): string {
  try {
    const { baseTag, forcedRegion } = parseFakerLocale(locale);

    // Se houver uma região forçada no dicionário de exceções
    if (forcedRegion !== undefined) {
      if (!forcedRegion) return ""; // Retorna sem bandeira (ex: Esperanto)
      return [...forcedRegion]
        .map((char) => String.fromCodePoint(char.charCodeAt(0) + REGIONAL_INDICATOR_OFFSET))
        .join("");
    }

    const region = new Intl.Locale(baseTag).maximize().region;

    // Se o código da região não tiver exatamente 2 letras ISO válidas, evita gerar emoji corrompido
    if (!region || region.length !== 2) return "";

    return [...region]
      .map((char) => String.fromCodePoint(char.charCodeAt(0) + REGIONAL_INDICATOR_OFFSET))
      .join("");
  } catch {
    return "";
  }
}

export function getLocaleDisplayName(
  locale: string,
  displayNames: Intl.DisplayNames | null
): string {
  try {
    const { baseTag, variant } = parseFakerLocale(locale);
    const flag = getFlagEmoji(locale);

    const baseName = displayNames?.of(baseTag) ?? baseTag;
    const fullName = variant ? `${baseName} (${variant})` : baseName;

    return flag ? `${flag} ${fullName}` : fullName;
  } catch {
    return locale;
  }
}

interface CountrySelectorProps<T> {
  value: T
  items: T[]
  onValueChange: (value: T) => void
  placeholder?: string
  emptyStateText?: string
}

export function LocaleSelect<T extends string>({
  value,
  items,
  placeholder,
  emptyStateText,
  onValueChange,
}: CountrySelectorProps<T>) {
  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(
        [toLocaleTag(value)],
        { type: "language" }
      );
    } catch {
      return null;
    }
  }, [value]);

  const formatItem = (locale: string) => getLocaleDisplayName(locale, displayNames);

  const handleChangeValue = (newValue: string | null) => {
    if (!newValue) return;

    onValueChange(newValue as T);
  };

  return (
    <Combobox
      value={value}
      items={items}
      itemToStringLabel={formatItem}
      onValueChange={handleChangeValue}
    >
      <ComboboxInput
        className="flex-1"
        placeholder={placeholder}
        onKeyDown={preventDefaultEscape}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {emptyStateText}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem
              key={item}
              value={item}
              className="capitalize"
            >
              {formatItem(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
