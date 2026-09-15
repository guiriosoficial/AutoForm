import browser from "webextension-polyfill";
import { MessageAction } from "@/configs";
import { getErrorMessage } from "@/lib/utils";
import type { GeneratorValue, GeneratorMessage, GeneratorMessageResponse } from "./index";

function executeFillInputElement(
  selector: string,
  value: GeneratorValue,
): GeneratorMessageResponse {
  const element = document.querySelector(selector);

  if (!element) {
    return {
      success: false,
      error: `Element not found: "${selector}"`,
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
      error: `Unsupported element type for selector: "${selector}"`,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}


export function createContentRunner() {
  browser.runtime.onMessage.addListener(
    (rawMessage: unknown): Promise<GeneratorMessageResponse> | undefined => {
      const message = rawMessage as GeneratorMessage;

      if (message.action !== MessageAction.FILL_INPUT_IN_CONTENT) return

      const response = executeFillInputElement(message.selector, message.value);
      return Promise.resolve(response);
    },
  );
}