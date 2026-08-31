import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function toTitleCase(str: string) {
  return str.replaceAll(/(^|[-_ ])(\w)/gu, (_, __, char) => char.toUpperCase())
}