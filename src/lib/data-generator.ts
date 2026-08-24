import { CATALOG_METHODS_BY_VALUE } from "@/lib/main-catalog";
import { parseJson5 } from "@/lib/json5";

export function generateValue(type: keyof typeof CATALOG_METHODS_BY_VALUE, configStr?: string): string {
  let options
  try {
    options = parseJson5(configStr ?? "");
  } catch {}

  return CATALOG_METHODS_BY_VALUE[type].invoke(options);
}

export function fillInputElement(selector: string, value: string | boolean) {
  if (!selector) return;

  const element = document.querySelector(selector);

  if (!element) {
    return;
  }

  if (element instanceof HTMLInputElement) {
    switch (element.type) {
      case "checkbox":
      case "radio":
        element.checked = Boolean(value);
        element.dispatchEvent(new Event("change", { bubbles: true }));
        break;

      default:
        element.value = String(value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
    }

    return;
  }

  if (element instanceof HTMLTextAreaElement) {
    element.value = String(value);

    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));

    return;
  }

  if (element instanceof HTMLSelectElement) {
    element.value = String(value);

    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
