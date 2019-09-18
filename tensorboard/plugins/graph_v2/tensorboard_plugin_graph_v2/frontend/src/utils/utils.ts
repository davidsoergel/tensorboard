export function flatten<T>(x: T[][]): T[] {
  return x.reduce((a, b) => a.concat(b), []);
}

export function isArrayPrefix<T>(prefix: T[], path: T[]) {
  return arraysEqual(prefix, path.slice(0, prefix.length));
}

export function arraysEqual<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  for (const i of a.keys()) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Map the values of a dict through a function, returning a new dict.
 */
export function mapValues<T extends { [key: string]: V }, V, W>(
  obj: T,
  f: (x: V, k?: string) => W
): { [key: string]: W } {
  return Object.assign(
    {},
    ...Object.keys(obj).map(k => ({ [k]: f(obj[k] as V, k) }))
  );
}
