import browser from "webextension-polyfill";
import {
  executeFillInputElement,
  type GeneratorMessageResponse,
  type GeneratorMessage
} from "@/lib/generator";
import { MessageAction } from "@/configs";

browser.runtime.onMessage.addListener(
  (rawMessage: unknown): Promise<GeneratorMessageResponse> | void => {
    const message = rawMessage as GeneratorMessage;

    if (message.action === MessageAction.FILL_INPUT) {
      const response = executeFillInputElement(message.selector, message.value);
      return Promise.resolve(response);
    }
  }
);
