import browser from "webextension-polyfill";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/lib/async";
import { STORAGE_CONFIG, type StorageKeys } from "@/configs";

const AreaName = {
  LOCAL: "local",
  SYNC: "sync",
  MANAGED: "managed",
  SESSION: "session",
} as const;

export function usePersistentState<T>(
  key: StorageKeys,
  initialState: T,
  persistenceDelay = STORAGE_CONFIG.PERSISTENCE_DELAY_MS,
) {
  const [state, setState] = useState<T>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate
  useEffect(() => {
    if (hydrated) return;

    let cancelled = false;

    browser.storage.local.get(key)
      .then((result) => {
        if (cancelled) return;

        const value = result[key] as T | undefined;

        setState(value ?? initialState);
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
  }, [key, initialState, hydrated]);

  // Persist
  const persist = useMemo(() =>
    debounce((newState: T) => {
      browser.storage?.local.set({
        [key]: newState,
      });
    }, persistenceDelay), [persistenceDelay, key]);

  useEffect(() => {
    if (!hydrated) return;

    persist(state);

    return () => persist.cancel();
  }, [key, state, hydrated, persist]);

  // Sync
  useEffect(() => {
    const handleStorageChange = (
      changes: Record<string, browser.Storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== AreaName.LOCAL) return;

      const change = changes[key];

      if (!change) return;

      const newValue = change.newValue as T | undefined;

      setState(newValue ?? initialState);
    };

    browser.storage?.onChanged.addListener(handleStorageChange);

    return () => {
      browser.storage?.onChanged.removeListener(handleStorageChange);
    };
  }, [key, initialState]);

  const remove = async () => {
    await browser.storage?.local.remove(key);
    setState(initialState);
  };

  return [
    state,
    setState,
    remove,
    hydrated,
  ] as const;
}
