export function unreachable(_: never): never {
  throw new Error("Didn't expect to get here");
}
