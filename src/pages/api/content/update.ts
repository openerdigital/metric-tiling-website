/* eslint-disable @typescript-eslint/naming-convention */
import type { NextApiRequest, NextApiResponse } from "next";
import {
  enforceContentType,
  enforceSameOrigin,
} from "src/lib/api/requestGuards";
import { requireClientEditor } from "src/lib/auth/requireClientEditor";
import { updateContentPayloadSchema } from "src/lib/contentSchema";
import { serverEnv } from "src/lib/env/server";
import { supabaseService } from "src/lib/supabase/supabaseService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  if (!enforceContentType(req, res, "application/json")) {
    return;
  }
  if (!enforceSameOrigin(req, res)) {
    return;
  }

  const access = await requireClientEditor({ req, res });
  if (!access.ok) {
    res.status(access.status).json({ error: access.error });
    return;
  }

  const parsed = updateContentPayloadSchema.safeParse(req.body || {});
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid content payload",
      details: parsed.error.flatten(),
    });
    return;
  }

  const { content } = parsed.data;

  const supabase = supabaseService();
  const isDev = process.env.NODE_ENV === "development";

  try {
    const client_id = serverEnv.CLIENT_ID;
    let revalidated = false;
    let revalidateError: string | null = null;
    const { error } = await supabase.from("clients").upsert(
      {
        client_id,
        content,
      },
      { onConflict: "client_id" }
    );

    if (error) throw error;

    // In production, invalidate ISR cache for the homepage after save.
    if (!isDev) {
      try {
        await res.revalidate("/");
        revalidated = true;
      } catch (e: any) {
        revalidateError = e?.message || "Failed to revalidate '/'";
        console.error("revalidate failed:", e);
      }
    } else {
      // In dev, getStaticProps runs on every request, so ISR revalidate is not required.
      revalidated = true;
    }

    res.status(200).json({
      ok: true,
      revalidated,
      revalidateError,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Update failed" });
  }
}
