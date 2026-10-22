export function normalizePath(input: string): string {
  const absolute = input.startsWith("/");
  const parts: string[] = [];
  for (const part of input.replaceAll("\\", "/").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") { if (parts.length && parts.at(-1) !== "..") parts.pop(); else if (!absolute) parts.push(".."); }
    else parts.push(part);
  }
  const value = parts.join("/");
  return absolute ? `/${value}` : value || ".";
}

export function dirname(input: string): string {
  const normalized = normalizePath(input);
  const index = normalized.lastIndexOf("/");
  if (index < 0) return ".";
  if (index === 0) return "/";
  return normalized.slice(0, index);
}

export function basename(input: string): string {
  const normalized = normalizePath(input);
  const index = normalized.lastIndexOf("/");
  return index < 0 ? normalized : normalized.slice(index + 1);
}

export function joinPath(...parts: string[]): string {
  return normalizePath(parts.filter(Boolean).join("/"));
}

export function extname(input: string): string {
  const base = basename(input);
  const index = base.lastIndexOf(".");
  return index <= 0 ? "" : base.slice(index);
}
