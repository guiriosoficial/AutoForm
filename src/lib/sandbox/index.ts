import browser from "webextension-polyfill";
import { type Locale, MessageAction } from "@/configs";

const SANDBOX_IFRAME_ID = "autoform-sandbox-iframe";
const SANDBOX_EXTENSION_TARGET_ORIGIN = `chrome-extension://${browser.runtime.id}`

function getSandboxIframe() {
  return document.querySelector<HTMLIFrameElement>(`#${SANDBOX_IFRAME_ID}`);
}

export function sendSandboxMessage(action: MessageAction, message: object) {
  const iframe = getSandboxIframe();

  if (!iframe) return;

  const send = () => {
    iframe.contentWindow?.postMessage(
      { action, ...message },
      { targetOrigin: SANDBOX_EXTENSION_TARGET_ORIGIN }
    );
  };

  if (iframe.dataset.ready === "true") {
    send();
    return;
  }

  iframe.addEventListener("load", () => {
    iframe.dataset.ready = "true";
    send();
  }, { once: true });
}

export function updateSandboxLocale(locale: Locale) {
  sendSandboxMessage(
    MessageAction.UPDATE_LOCALE_IN_SANDBOX,
    { locale },
  );
}


export function createSandboxIframe(locale: Locale) {
  let iframe = getSandboxIframe();

  if (iframe) return;

  iframe = document.createElement("iframe");

  iframe.id = SANDBOX_IFRAME_ID;
  iframe.src = browser.runtime.getURL("src/entrypoints/sandbox/index.html");
  iframe.style.display = "none";

  iframe.addEventListener("load", () => {
    updateSandboxLocale(locale);
  }, { once: true });

  // document.body.append(iframe);
}

export function executeInSandbox<T = unknown>(
  code: string,
  scope: unknown = [],
): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();

    const handleMessage = (event: MessageEvent) => {
      const {
        id: dataId,
        action,
        success,
        result,
        error,
      } = event.data ?? {};

      if (
        dataId !== id ||
        action !== MessageAction.EXECUTE_IN_SANDBOX
      ) {
        return;
      }

      window.removeEventListener("message", handleMessage);

      if (success) {
        resolve(result);
      } else {
        reject(error);
      }
    };

    window.addEventListener("message", handleMessage);

    sendSandboxMessage(
      MessageAction.EXECUTE_IN_SANDBOX,
      { id, code, scope },
    );
  });
}
