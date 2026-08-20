import {useEffect, useMemo, useState} from "react";
import browser from "webextension-polyfill";
import { STORAGE_PERSISTENCE_DELAY_MS } from "@/configs";
import type { StorageKeys } from "@/configs";
import {debounce} from "@/lib/utils.ts";

const AreaName = {
  LOCAL: "local",
  SYNC: "sync",
  MANAGED: "managed",
  SESSION: "session",
} as const

export function usePersistentState<T>(
  key: StorageKeys,
  initialState: T,
  persistenceDelay = STORAGE_PERSISTENCE_DELAY_MS,
) {
  const [state, setState] = useState<T>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate
  useEffect(() => {
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
  }, [key]);

  // Persist
  const persist = useMemo(() => {
    return debounce((state: T) => {
      browser.storage?.local.set({
        [key]: state,
      });
    }, persistenceDelay)
  }, [persistenceDelay, key, debounce])

  useEffect(() => {
    if (!hydrated) return;

    persist(state);

    return () => persist.cancel();
  }, [key, state, persistenceDelay, hydrated]);

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