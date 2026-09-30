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
  options?: {
    spaced?: boolean,
    suffix?: string,
  },
) {
  const { spaced, suffix } = options ?? {};

  const escapedBaseName = name.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`);

  const sequenceRegex = suffix
    ? new RegExp(`^${escapedBaseName}\\s*\\(${suffix}\\s*(\\d+)\\)$`, "u")
    : new RegExp(`^${escapedBaseName}\\s*(\\d+)$`, "u");


  let highestSequenceNumber = 0;

  for (const item of list) {
    const value = String(item[key] ?? "");
    const match = value.match(sequenceRegex);

    if (!match) continue;

    const sequenceNumber = Number(match[1]);
    highestSequenceNumber = Math.max(highestSequenceNumber, sequenceNumber);
  }
  const nextNumber = highestSequenceNumber + 1;
  const space = spaced ? " " : "";

  if (suffix) {
    return `${name}${space}(${suffix}${space}${nextNumber})`;
  }

  return `${name}${space}${nextNumber}`;
}
