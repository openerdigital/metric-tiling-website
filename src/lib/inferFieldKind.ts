// lib/inferFieldKind.ts
export type FieldKind =
  | "text"
  | "textarea"
  | "url"
  | "media"
  | "media:image"
  | "media:video"
  | "stringList"
  | "repeater"
  | "group";

type InferConfig = {
  textareaKeys: Set<string>;
  textKeys: Set<string>;
  urlKeys: Set<string>;
  mediaKeyIncludes: {
    image: string[]; // if key includes any of these => image
    video: string[]; // if key includes any of these => video
  };
};

export const defaultInferConfig: InferConfig = {
  textareaKeys: new Set([
    "paragraph",
    "paragraph1",
    "paragraph2",
    "description",
    "quote",
    "answer",
  ]),
  textKeys: new Set([
    "heading",
    "subheading",
    "navigationLabel",
    "button",
    "author",
    "phone",
    "email",
    "address",
    "question",
  ]),
  urlKeys: new Set(["instagram", "facebook", "linkedIn"]),
  mediaKeyIncludes: {
    image: ["image", "logo"],
    video: ["video"],
  },
};

export function inferFieldKind(
  key: string,
  value: unknown,
  cfg: InferConfig = defaultInferConfig
): FieldKind {
  // arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return "stringList"; // safe default
    return typeof value[0] === "string" ? "stringList" : "repeater";
  }

  // nested objects
  if (value && typeof value === "object") return "group";

  const k = key.toLowerCase();

  if (k === "video") return "url";

  // media by key substring
  if (k.includes("graphic")) return "media";
  if (cfg.mediaKeyIncludes.video.some((s) => k.includes(s)))
    return "media:video";
  if (cfg.mediaKeyIncludes.image.some((s) => k.includes(s)))
    return "media:image";

  // explicit key matches
  if (cfg.textareaKeys.has(key)) return "textarea";
  if (cfg.textKeys.has(key)) return "text";
  if (cfg.urlKeys.has(key)) return "url";

  // default
  return "text";
}

export function labelFromKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/(\D)(\d+)/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}
