import _ from "lodash";

export function debounce<T extends (...args: never[]) => void>(callback: T, delay: number) {
  return _.debounce<T>(callback, delay);
}

export function deferPredicate<T extends (...args: never[]) => void>(callback: T, delay: number) {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const fn = (...args: Parameters<T>) => {
    if (timerId !== null) return;

    timerId = setTimeout(() => {
      timerId = null;
      callback(...args);
    }, delay);
  };

  fn.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return fn;
}