import browser from "webextension-polyfill";
import { MessageAction } from "@/configs";
import {
  executeFillInputElement,
  type GeneratorMessageResponse,
  type GeneratorMessage
} from "@/lib/generator";

browser.runtime.onMessage.addListener(
  (rawMessage: unknown): Promise<GeneratorMessageResponse> | void => {
    const message = rawMessage as GeneratorMessage;

    if (message.action === MessageAction.FILL_INPUT) {
      const response = executeFillInputElement(message.selector, message.value);
      return Promise.resolve(response);
    }
  }
);
