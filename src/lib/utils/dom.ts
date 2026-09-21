import type { KeyboardEvent } from "react";

export function preventDefaultEscape(event: KeyboardEvent) {
  if (event.key === "Escape") event.preventDefault();
}
