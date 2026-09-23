export function getDuplicatedItemsByKey<T>(
  referenceItems: T[],
  targetItems: T[],
  key: keyof T,
): T[] {
  const referenceSet = new Set(referenceItems.map((item) => item[key]));
  return targetItems.filter((item) => referenceSet.has(item[key]));
}
