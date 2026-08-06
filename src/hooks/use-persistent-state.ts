import { useEffect, useState } from 'react';
import {
  STORAGE_PERSISTENCE_DELAY_MS,
  STORAGE_EVENT_NAME,
  type LocalStorageKeys
} from '@/configs';

function getInitialState<T>(
  key: LocalStorageKeys,
  initialState: T,
) {
  const item = localStorage.getItem(key);

  if (!item) {
    return initialState;
  }

  try {
    return JSON.parse(item) as T;
  } catch {
    localStorage.removeItem(key);
    return initialState;
  }
}

export function usePersistentState<T>(
  key: LocalStorageKeys,
  initialState: T,
  persistenceDelay = STORAGE_PERSISTENCE_DELAY_MS
) {
  const [state, setState] = useState<T>(() =>
    getInitialState<T>(key, initialState)
  );

  function remove() {
    localStorage.removeItem(key);
    setState(initialState);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, persistenceDelay);

    return () => clearTimeout(timer);
  }, [key, state, persistenceDelay]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== key) return;

      if (event.newValue == null) {
        setState(initialState);
        return;
      }

      try {
        setState(JSON.parse(event.newValue));
      } catch {}
    }

    window.addEventListener(STORAGE_EVENT_NAME, onStorage);

    return () => window.removeEventListener(STORAGE_EVENT_NAME, onStorage);
  }, [key, initialState]);

  return [
    state,
    setState,
    remove,
  ] as const;
}