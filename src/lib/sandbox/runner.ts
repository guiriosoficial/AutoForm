import { getErrorMessage } from "@/lib/utils";

export function createSandboxRunner() {
  window.addEventListener("message", async (event) => {
    const { id, code, scope } = event.data;

    if (!id) return;

    try {
      // oxlint-disable-next-line no-new-func
      const userFn = new Function(`return (${code})()`);
      const result = await userFn(...scope);

      event.source?.postMessage(
        { id, success: true, result },
        { targetOrigin: event.origin },
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