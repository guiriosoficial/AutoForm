import { type Locale, MessageAction } from "@/configs";
import { getCatalogInstances } from "@/lib/catalog/registry";


export function createSandboxRunner() {
  let runtime: Record<string, object> = {};
  let runtimeKeys: string[] = [];
  let runtimeValues: object[] = [];
  let currentLocale: Locale = "" as Locale;

  window.addEventListener("message", async (event) => {
    const { action, id } = event.data;

    if (action === MessageAction.UPDATE_LOCALE_IN_SANDBOX) {
      const { locale: nextLocale } = event.data;

      if (nextLocale === currentLocale) return;

      currentLocale = nextLocale
      runtime = getCatalogInstances(nextLocale)
      runtimeKeys = Object.keys(runtime)
      runtimeValues = Object.values(runtime)

      return;
    }

    if (action === MessageAction.EXECUTE_IN_SANDBOX && event.data.id) {
      const { code, scope } = event.data;

      try {
        const normalizedCode = code.trim().replaceAll(";", "");
        // oxlint-disable-next-line no-new-func
        const userFn = new Function(
          ...runtimeKeys,
          "scope",
          `return (${normalizedCode})(...scope)`,
        );
        const result = await userFn(...runtimeValues, scope);

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
    }
  });
}
