import _ from "lodash";

export function debounce<T extends (...args: never[]) => void>(callback: T, delay: number) {
  return _.debounce<T>(callback, delay);
}
