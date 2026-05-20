import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireClientEditor } from "src/lib/auth/requireClientEditor";
import { publicEnv } from "src/lib/env/public";
import { serverEnv } from "src/lib/env/server";
import { supabaseService } from "src/lib/supabase/supabaseService";

function isMissingColumnError(error: unknown, columnName: string) {
  const message = String((error as any)?.message || "").toLowerCase();
  return (
    message.includes("column") && message.includes(columnName.toLowerCase())
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const access = await requireClientEditor({ req, res });
  if (!access.ok) {
    res.status(access.status).json({ error: access.error });
    return;
  }

  const checks: Record<string, unknown> = {};
  const supabase = supabaseService();

  const columns = [
    "client_id",
    "content",
    "allowed_editor_ids",
    "allowed_editor_emails",
  ] as const;

  await Promise.all(
    columns.map(async (column) => {
      const probe = await supabase
        .from("clients")
        .select(column)
        .eq("client_id", serverEnv.CLIENT_ID)
        .limit(1);

      checks[`column:${column}`] =
        !probe.error || !isMissingColumnError(probe.error, column);
    })
  );

  const anon = createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const anonRead = await anon
    .from("clients")
    .select("client_id")
    .eq("client_id", serverEnv.CLIENT_ID)
    .maybeSingle();

  checks.anonReadBlocked = !anonRead.data;
  checks.anonReadError = anonRead.error?.message || null;
  checks.ownerBypassConfigured = !!serverEnv.ADMIN_USER_ID;

  res.status(200).json({
    ok: true,
    checks,
  });
}
