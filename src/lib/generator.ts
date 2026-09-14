import browser from "webextension-polyfill";
import { executeInSandbox } from "@/lib/dom";
import { getErrorMessage } from "@/lib/errors";
import { isArray } from "@/lib/guards";
import { parseJson5 } from "@/lib/json5";
import { MessageAction } from "@/configs"
import type { CatalogMethod } from "@/lib/catalog";

export type GeneratorPrimitive =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export type GeneratorValue =
  | GeneratorPrimitive
  | GeneratorValue[]
  | { [key: string]: GeneratorValue };

export interface GeneratorMessage {
  action: typeof MessageAction.FILL_INPUT;
  selector: string;
  value: string | boolean;
}

export interface GeneratorMessageResponse {
  success: boolean;
  error?: string;
}

export async function generateValue(method: CatalogMethod, optionsStr?: string): Promise<GeneratorValue> {
  if (!method) return "";

  let options = {};

  try {
    options = parseJson5(optionsStr ?? "");
  } catch {
    // TODO: Implement Error Handling
  }

  if (method.code) return await executeInSandbox<GeneratorValue>(method.code, options);

  if (!method.invoke) return;

  if (isArray(options)) return method.invoke(...options);

  return method.invoke(options);
}

export async function fillInputElement(
  selector: string,
  value: GeneratorValue
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
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}

export function executeFillInputElement(selector: string, value: GeneratorValue): GeneratorMessageResponse {
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
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}