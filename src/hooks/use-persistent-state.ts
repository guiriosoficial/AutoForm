import browser from "webextension-polyfill";
import { useEffect, useRef, useState } from "react";
import { debounce } from "@/lib/utils";
import { STORAGE_CONFIG, StorageAreaNames, type StorageKeys } from "@/configs";

export function usePersistentState<T>(
  storageKey: StorageKeys,
  initialState: T,
  persistenceDelay = STORAGE_CONFIG.PERSISTENCE_DELAY_MS,
) {
  const [state, setState] = useState<T>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate
  useEffect(() => {
    if (hydrated) return;

    let cancelled = false;

    browser.storage.local
      .get(storageKey)
      .then((result) => {
        if (cancelled) return;

        const storedValue = result[storageKey] as T | undefined;

        setState(storedValue ?? initialState);
        setHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;

        setState(initialState);
        setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [storageKey, initialState, hydrated]);

  // Persist
  const persist = useRef(
    debounce((newState: T) => {
      browser.storage?.local.set({
        [storageKey]: newState,
      });
    }, persistenceDelay)
  ).current;

  useEffect(() => {
    if (!hydrated) return;

    persist(state);

    return () => persist.cancel();
  }, [storageKey, state, hydrated, persist]);

  // Sync
  useEffect(() => {
    const handleStorageChange = (
      changes: Record<string, browser.Storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== StorageAreaNames.LOCAL) return;

      const change = changes[storageKey];

      if (!change) return;

      const newValue = change.newValue as T | undefined;

      setState(newValue ?? initialState);
    };

    browser.storage?.onChanged.addListener(handleStorageChange);

    return () => {
      browser.storage?.onChanged.removeListener(handleStorageChange);
    };
  }, [storageKey, initialState]);

  const remove = async () => {
    await browser.storage?.local.remove(storageKey);
    setState(initialState);
  };

  return [
    state,
    setState,
    remove,
    hydrated,
  ] as const;
}
