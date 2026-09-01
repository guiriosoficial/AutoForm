export function toTitleCase(str: string) {
  return str.replaceAll(/(^|[-_ ])(\w)/gu, (_, __, char) => char.toUpperCase())
}

export function createNextSequencedName<T extends object>(
  list: T[],
  key: keyof T,
  name: string,
  spaced: boolean = true,
) {
  const escapedName = name.replaceAll(/[^\w\s]/gu, "\\$&");
  const nameRegex = RegExp(`^${escapedName}\\s*(\\d+)$`);

  const nextNumber = list.reduce((max, item) => {
    const value = String(item[key] ?? "");
    const match = value.match(nameRegex);

    if (!match) return max;

    return Math.max(max, Number(match[1]));
  }, 0) + 1;

  return `${name}${spaced ? " " : ""}${nextNumber}`
}
