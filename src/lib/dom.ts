import browser from "webextension-polyfill";
import { getErrorMessage } from "@/lib/errors";
import type { KeyboardEvent } from "react";

export function preventDefaultEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
  }
}

export function createSandboxRunner() {
  window.addEventListener("message", async (event) => {
    const { id, code, scope } = event.data;
    if (!id) return;

    try {
      const keys = Object.keys(scope || {});
      const values = Object.values(scope || {});

      // oxlint-disable-next-line no-new-func
      const userFn = new Function(...keys, `return (async () => { ${code} })()`);
      const result = await userFn(...values);

      event.source?.postMessage(
        { id, success: true, result },
        { targetOrigin: event.origin }
      );
    } catch (error) {
      const message = getErrorMessage(error);
      event.source?.postMessage(
        { id, success: false, error: message },
        { targetOrigin: event.origin },
      );
    }
  });
}

export function executeInSandbox<T = unknown>(
  code: string,
  scope: Record<string, unknown> = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();

    // Cria/Reutiliza o iframe do Sandbox
    let iframe = document.querySelector("#extension-sandbox-iframe") as HTMLIFrameElement;

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "extension-sandbox-iframe";
      iframe.src = browser.runtime.getURL("src/entrypoints/sandbox/index.html");
      iframe.style.display = "none";
      document.body.append(iframe);
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.id === id) {
        window.removeEventListener("message", handleMessage);
        if (event.data.success) {
          resolve(event.data.result);
        } else {
          reject(new Error(event.data.error));
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Envia o código e o escopo para o Iframe assim que estiver pronto
    const send = () => {
      iframe.contentWindow?.postMessage({ id, code, scope }, "*");
    };

    if (iframe.contentWindow) {
      send();
    } else {
      iframe.addEventListener("load", send);
    }
  });
}
