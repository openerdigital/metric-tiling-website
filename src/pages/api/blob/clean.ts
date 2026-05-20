import { del, list } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import { serverEnv } from "src/lib/env/server";
import { supabaseService } from "src/lib/supabase/supabaseService";

function blobPathnameFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith(".public.blob.vercel-storage.com")) return null;
    return u.pathname; // includes leading '/'
  } catch {
    return null;
  }
}

function normalizePathname(p: string) {
  return p.startsWith("/") ? p.slice(1) : p;
}

function collectBlobPathnames(value: unknown, out: Set<string>) {
  if (typeof value === "string") {
    const p = blobPathnameFromUrl(value);
    if (p) out.add(normalizePathname(p));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((v) => collectBlobPathnames(v, out));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((v) => {
      collectBlobPathnames(v, out);
    });
  }
}

async function listAllBlobs(
  prefix: string,
  cursor?: string,
  acc: any[] = []
): Promise<any[]> {
  const page = await list({ cursor, limit: 1000, prefix });
  const nextAcc = acc.concat(page.blobs);
  return page.cursor ? listAllBlobs(prefix, page.cursor, nextAcc) : nextAcc;
}

async function deleteInChunks(
  paths: string[],
  chunkSize = 50
): Promise<number> {
  const chunks = Array.from(
    { length: Math.ceil(paths.length / chunkSize) },
    (_, idx) => paths.slice(idx * chunkSize, (idx + 1) * chunkSize)
  );

  await Promise.all(chunks.map((chunk) => del(chunk)));
  return paths.length;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const auth = req.headers.authorization;
  if (auth !== `Bearer ${serverEnv.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dryRun = req.query.dry === "1";

  const supabase = supabaseService();

  const clientId = serverEnv.CLIENT_ID;
  const { data, error } = await supabase
    .from("clients")
    .select("content")
    .eq("client_id", clientId)
    .single();

  if (error || !data?.content) {
    return res.status(200).json({ ok: true, deleted: 0, note: "No content" });
  }

  // MARK
  const referenced = new Set<string>();
  collectBlobPathnames(data.content, referenced);

  // SWEEP
  const cutoffMs = 60 * 60 * 1000; // 1 hour
  const now = Date.now();

  const clientPrefix = `${clientId}/`;
  const blobs = await listAllBlobs(clientPrefix);
  const toDelete = blobs
    .filter((b) => now - new Date(b.uploadedAt).getTime() >= cutoffMs)
    .map((b) => normalizePathname(b.pathname))
    .filter((path) => !referenced.has(path));

  const deleted =
    dryRun || toDelete.length === 0 ? 0 : await deleteInChunks(toDelete, 50);

  console.log("clean up log:", {
    dryRun,
    referenced: referenced.size,
    candidates: toDelete.length,
    totalBlobs: blobs.length,
    toDelete,
    deleted,
  });

  return res.status(200).json({
    ok: true,
    referenced: referenced.size,
    candidates: toDelete.length,
    totalBlobs: blobs.length,
    toDelete,
    deleted,
    dryRun,
  });
}

// curl -s \
//   -H "Authorization: Bearer ygpKk3kADyqKYxpTzJjWgv" \
//   "http://localhost:3000/api/blob/clean?dry=1"
