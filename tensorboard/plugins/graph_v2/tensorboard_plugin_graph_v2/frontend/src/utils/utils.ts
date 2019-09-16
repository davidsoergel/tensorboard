function flatten<T>(x: T[][]): T[] {
  return x.reduce((a, b) => a.concat(b));
}

function isArrayPrefix<T>(prefix: T[], path: T[]) {
  return arraysEqual(prefix, path.slice(0, prefix.length));
}

function arraysEqual<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  for (const i of a.keys()) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
