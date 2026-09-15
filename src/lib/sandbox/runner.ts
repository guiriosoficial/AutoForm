import { MessageAction } from "@/configs";

export function createSandboxRunner() {
  window.addEventListener("message", async (event) => {
    const { action, id, code, scope } = event.data;

    if (!id || action !== MessageAction.EXECUTE_IN_SANDBOX) return;

    try {
      // oxlint-disable-next-line no-new-func
      const userFn = new Function(`return (${code})()`);
      const result = await userFn(...scope);

      event.source?.postMessage(
        { id, action, result, success: true },
        { targetOrigin: event.origin },
      );
    } catch (error) {
      event.source?.postMessage(
        { id, action, error, success: false },
        { targetOrigin: event.origin },
      );
    }
  });
}
