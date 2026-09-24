const TITLE_CASE_PATTERN = /(?<separator>^|[-_ ]+)(?<char>[a-z])|(?<=\d)(?<digit>[a-z])/giu;

export function toTitleCase(
  str: string,
  options?: { keepSeparators?: boolean },
) {
  const { keepSeparators = false } = options ?? {};

  return str.replaceAll(TITLE_CASE_PATTERN, (...args) => {
    const groups = args.pop();

    if (groups.digit) return groups.digit.toUpperCase();

    return `${keepSeparators ? groups.separator : ""}${groups.char.toUpperCase()}`;
  });
}

export function removeSpaces(str: string) {
  return str.replaceAll(/\s/gu, "");
}

export function createNextSequencedName<T extends object>(
  list: T[],
  key: keyof T,
  name: string,
  options?: { spaced?: boolean },
) {
  const escapedName = name.replaceAll(/[^\w\s]/gu, "$&");
  const nameRegex = new RegExp(`^${escapedName}\\s*(\\d+)$`, "u");
  let maxNumber = 0;

  for (const item of list) {
    const value = String(item[key] ?? "");
    const match = value.match(nameRegex);

    if (!match) continue;

    maxNumber = Math.max(maxNumber, Number(match[1]));
  }

  const nextNumber = maxNumber + 1;
  const space = options?.spaced ? " " : "";
  return `${name}${space}${nextNumber}`;
}
