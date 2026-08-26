import { catalogMethodsById } from "@/lib/catalog";
import { parseJson5 } from "@/lib/json5";

export function generateValue(type: string, configStr?: string): string {
  const method = catalogMethodsById.get(type)

  if (!method) return "";

  let options

  try {
    options = parseJson5(configStr ?? "");
  } catch {

  }

  return method.invoke(options);
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
