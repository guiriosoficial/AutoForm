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

      event.source?.postMessage({ id, success: true, result }, event.origin);
    } catch (error) {
      const message = getErrorMessage(error)
      event.source?.postMessage({ id, success: false, error: message }, event.origin);
    }
  });
}

export function executeInSandbox<T = unknown>(
  code: string,
  scope: Record<string, unknown> = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();

    // Cria/Reutiliza o iframe do Sandbox
    let iframe = document.querySelector("#extension-sandbox-iframe") as HTMLIFrameElement;

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "extension-sandbox-iframe";
      iframe.src = browser.runtime.getURL("sandbox.html");
      iframe.style.display = "none";
      document.body.append(iframe);
    }
