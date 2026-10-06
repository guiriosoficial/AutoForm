export interface ConflictingItemPair<T> {
  reference: T;
  target: T;
}

export function findConflictingItemPairs<T>(
  referenceItems: T[],
  targetItems: T[],
  sameKey: keyof T,
  differentKey: keyof T,
): ConflictingItemPair<T>[] {
  const referenceMap = new Map(
    referenceItems.map((item) => [item[sameKey], item]),
  );

  return targetItems.flatMap((target) => {
    const reference = referenceMap.get(target[sameKey]);

    if (!reference || reference[differentKey] === target[differentKey]) {
      return [];
    }

    return [{ reference, target }];
  });
}
