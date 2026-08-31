import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
  return str.replaceAll(/(^|[-_ ])(\w)/gu, (_, __, char) => char.toUpperCase())
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export const getItemNameRegex = (name: string) => {
  const escapedName = name.replaceAll(/[^\w\s]/gu, "\\$&");
  return new RegExp(`^${escapedName} (\\d+)$`);
};

export function getNewListItemNumber<T extends Record<string, any>>(list: T[], key: keyof T, name: string) {
  return list.reduce((max, item) => {
    const regex = getItemNameRegex(name);
    const match = item[key].match(regex)

    if (!match) return max;

    return Math.max(max, Number(match[1])) + 1;
  }, 0);
}
