import browser from "webextension-polyfill";
import { executeInSandbox } from "@/lib/sandbox";
import { getErrorMessage, isArray, parseJson5 } from "@/lib/utils";
import { MessageAction } from "@/configs";
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
  action: typeof MessageAction.FILL_INPUT_IN_CONTENT;
  selector: string;
  value: string | boolean;
}

export interface GeneratorMessageResponse {
  success: boolean;
  error?: string;
}

export async function generateValue(
  method: CatalogMethod,
  optionsStr?: string,
): Promise<GeneratorValue> {
  if (!method) return "";

  let options = {};

  try {
    options = parseJson5(optionsStr ?? "");
  } catch {
    // TODO: Implement Error Handling
  }

  const args = isArray(options) ? options : [options];

  if (method.code) return await executeInSandbox<GeneratorValue>(method.code, args);

  if (!method.invoke) return;

  return method.invoke(...args);
}

export async function fillInputElement(
  selector: string,
  value: GeneratorValue,
): Promise<GeneratorMessageResponse | undefined> {
  if (!selector) return;

  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.id) return;

  try {
    const response = await browser.tabs.sendMessage(tab.id, {
      action: MessageAction.FILL_INPUT_IN_CONTENT,
      selector,
      value,
    });

    return response as GeneratorMessageResponse;
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
