import { sep as pathSeparator, join } from "path";

const cwd = process.cwd();

export function censureString(string: string): string {
  return string?.replaceAll(cwd, join(pathSeparator, "vm")) ?? "";
}

export function censureError(error: Error): void {
  if (!error) {
    return;
  }

  let obj = error;
  while (obj !== Object.prototype) {
    Object.getOwnPropertyNames(obj).forEach((name) => {
      const value = obj[name];
      if (typeof value === "string") {
        obj[name] = censureString(value);
      }
    });
    obj = Object.getPrototypeOf(obj);
  }
}
