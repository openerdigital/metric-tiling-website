export function slugify(str: string) {
  if (!str) return "";
  return str.toLowerCase().trim().replace(/\s+/g, "-");
}
