import browser from "webextension-polyfill";

export function executeInSandbox<T = unknown>(
  code: string,
  scope: unknown = [],
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
      if (event.data?.id !== id) return;

      window.removeEventListener("message", handleMessage);

      if (event.data.success) {
        resolve(event.data.result);
      } else {
        reject(new Error(event.data.error));
      }

    };

    window.addEventListener("message", handleMessage);

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
