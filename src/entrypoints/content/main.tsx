import browser from "webextension-polyfill";
import {
  type GeneratorMessage,
  type GeneratorMessageResponse,
  executeFillInputElement,
} from "@/lib/generator";
import { MessageAction } from "@/configs";

browser.runtime.onMessage.addListener(
  (rawMessage: unknown): Promise<GeneratorMessageResponse> | undefined => {
    const message = rawMessage as GeneratorMessage;

    if (message.action === MessageAction.FILL_INPUT) {
      const response = executeFillInputElement(message.selector, message.value);
      return Promise.resolve(response);
    }
  },
);
