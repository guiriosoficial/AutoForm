import browser from "webextension-polyfill";
import { MessageAction } from "@/configs";

export function executeInSandbox<T = unknown>(
  code: string,
  scope: unknown = [],
): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();

    let iframe = document.querySelector("#extension-sandbox-iframe") as HTMLIFrameElement;

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "extension-sandbox-iframe";
      iframe.src = browser.runtime.getURL("src/entrypoints/sandbox/index.html");
      iframe.style.display = "none";
      document.body.append(iframe);
    }

    const handleMessage = (event: MessageEvent) => {
      const { id: dataId, action, success, result, error } = event.data ?? {};

      if (dataId !== id || action !== MessageAction.EXECUTE_IN_SANDBOX) return;

      window.removeEventListener("message", handleMessage);

      if (success) {
        resolve(result);
      } else {
        reject(error);
      }
    };

    window.addEventListener("message", handleMessage);

    const send = () => {
      iframe.contentWindow?.postMessage({
        action: MessageAction.EXECUTE_IN_SANDBOX,
        id,
        code,
        scope,
      }, "*");
    };

    if (iframe.contentWindow) {
      send();
    } else {
      iframe.addEventListener("load", send);
    }
  });
}
