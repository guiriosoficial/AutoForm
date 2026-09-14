import _ from "lodash";

export function isString(value: unknown): value is string {
  return _.isString(value);
}

export function isOptionalString(value: unknown): value is string | null | undefined {
  return isString(value) || _.isNil(value);
}

export function isPopulatedString(value: unknown): value is string {
  return isString(value) && _.trim(value).length > 0;
}

export function isNumber(value: unknown): value is number {
  return _.isFinite(value);
}

export function isTimestamp(value: unknown): value is number {
  return isNumber(value) && !_.isNaN(new Date(value).getTime());
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return _.isObjectLike(value);
}

export function isFunction(value: unknown): value is (...args: never[]) => unknown {
  return _.isFunction(value);
}

export function isArray(value: unknown): value is unknown[] {
  return _.isArray(value);
}
