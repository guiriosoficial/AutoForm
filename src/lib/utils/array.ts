export interface ConflictingItem<T> {
  reference: T;
  target: T;
}

export function getItemsBySameAndDifferentKey<T>(
  referenceItems: T[],
  targetItems: T[],
  sameKey: keyof T,
  differentKey: keyof T,
): ConflictingItem<T>[] {
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
