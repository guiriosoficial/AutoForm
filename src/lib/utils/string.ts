export function toTitleCase(str: string) {
  return str.replaceAll(/(?:^|[-_ ])(?<char>\w)/gu, (...args) => {
    const groups = args.pop();
    return groups.char.toUpperCase();
  });
}

export function removeSpaces(str: string) {
  return str.replaceAll(/\s/ug, "")
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
