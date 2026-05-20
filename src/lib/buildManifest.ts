// lib/buildManifest.ts
import { type FieldKind, inferFieldKind } from "./inferFieldKind";

export type Node =
  | { kind: "section"; key: string; path: string; children: Node[] }
  | { kind: "field"; key: string; path: string; fieldKind: FieldKind }
  | {
      kind: "repeater";
      key: string;
      path: string;
      itemShape: Record<string, FieldKind>;
    }
  | { kind: "stringList"; key: string; path: string };

export function buildManifest(content: any): Node[] {
  // top level sections
  return Object.entries(content ?? {}).map(([sectionKey, sectionValue]) => ({
    kind: "section" as const,
    key: sectionKey,
    path: sectionKey,
    children: buildChildren(sectionValue, sectionKey),
  }));
}

function buildChildren(obj: any, basePath: string): Node[] {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];

  return Object.entries(obj).map(([key, value]) => {
    const path = `${basePath}.${key}`;
    const kind = inferFieldKind(key, value);

    if (kind === "group") {
      return {
        kind: "field" as const,
        key,
        path,
        fieldKind: "group",
      };
    }

    if (kind === "stringList") {
      return { kind: "stringList" as const, key, path };
    }

    if (kind === "repeater") {
      // infer item shape from the first item (good enough for your 1-template case)
      const first = Array.isArray(value) ? value[0] : null;
      const itemShape: Record<string, FieldKind> = {};

      if (first && typeof first === "object" && !Array.isArray(first)) {
        for (const [ik, iv] of Object.entries(first)) {
          itemShape[ik] = inferFieldKind(ik, iv);
        }
      }

      return { kind: "repeater" as const, key, path, itemShape };
    }

    return { kind: "field" as const, key, path, fieldKind: kind };
  });
}
