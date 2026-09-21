export function debounce<T extends (...args: never[]) => void>(callback: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

export function deferPredicate<T extends (...args: never[]) => void>(callback: T, delay: number) {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const predicated = (...args: Parameters<T>) => {
    if (timerId !== null) return;

    timerId = setTimeout(() => {
      timerId = null;
      callback(...args);
    }, delay);
  };

  predicated.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return predicated;
}