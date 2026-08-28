import browser from "webextension-polyfill";
import { parseJson5 } from "@/lib/json5";
import { getErrorMessage } from "@/lib/utils";
import { catalogMethodsById } from "@/lib/catalog";
import { MessageAction } from "@/configs"

export interface GeneratorMessage {
  action: typeof MessageAction.FILL_INPUT;
  selector: string;
  value: string | boolean;
}

export interface GeneratorMessageResponse {
  success: boolean,
  error?: string
}

// TODO: Implement Error Handling
export function generateValue(type: string, optionsStr?: string): string {
  const method = catalogMethodsById.get(type)

  if (!method) return "";

  let options

  try {
    options = parseJson5(optionsStr ?? "");
  } catch {
  }

  return method.invoke(options);
}

export async function fillInputElement(
  selector: string,
  value: string | boolean
): Promise<GeneratorMessageResponse | null> {
  if (!selector) return null;

  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab?.id) return null;

  try {
    const response = await browser.tabs.sendMessage(tab.id, {
      action: MessageAction.FILL_INPUT,
      selector,
      value,
    });

    return response as GeneratorMessageResponse;
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    };
  }
}

export function executeFillInputElement(selector: string, value: string | boolean): GeneratorMessageResponse {
  const element = document.querySelector(selector);

  if (!element) {
    return {
      success: false,
      error: `Element not found: "${selector}"`
    };
  }

  try {
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

      return { success: true };
    }

    if (element instanceof HTMLTextAreaElement) {
      element.value = String(value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));

      return { success: true };
    }

    if (element instanceof HTMLSelectElement) {
      element.value = String(value);
      element.dispatchEvent(new Event("change", { bubbles: true }));

      return { success: true };
    }

    return {
      success: false,
      error: `Unsupported element type for selector: "${selector}"`
    };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    };
  }
}