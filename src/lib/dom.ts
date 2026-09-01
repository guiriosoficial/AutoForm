import type { KeyboardEvent } from "react";

export function preventDefaultEscape(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
  }
}
