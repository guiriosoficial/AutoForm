import browser from "webextension-polyfill";
import { useEffect, useRef, useState } from "react";
import { debounce } from "@/lib/utils";
import { type StorageKeys, StorageAreaNames, STORAGE_CONFIG } from "@/configs";

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
  const persistState = useRef(
    debounce((nextState: T) => {
      browser.storage?.local.set({
        [storageKey]: nextState,
      });
    }, persistenceDelay),
  ).current;

  useEffect(() => {
    if (!hydrated) return;

    persistState(state);

    return () => persistState.cancel();
  }, [storageKey, state, hydrated, persistState]);

  // Sync
  useEffect(() => {
    const handleStorageChange = (
      storageChanges: Record<string, browser.Storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== StorageAreaNames.LOCAL) return;

      const currentChange = storageChanges[storageKey];

      if (!currentChange) return;

      const nextValue = currentChange.newValue as T;

      setState(nextValue);
    };

    browser.storage?.onChanged.addListener(handleStorageChange);

    return () => {
      browser.storage?.onChanged.removeListener(handleStorageChange);
    };
  }, [storageKey]);

  const removeState = async () => {
    await browser.storage?.local.remove(storageKey);
    setState(initialState);
  };

  return [
    state,
    setState,
    removeState,
    hydrated,
  ] as const;
}
