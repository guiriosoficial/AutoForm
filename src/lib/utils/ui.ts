import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import type { KeyboardEvent } from "react";

export function preventDefaultEscape(event: KeyboardEvent) {
  if (event.key === "Escape") event.preventDefault();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}