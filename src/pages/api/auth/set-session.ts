import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseApi } from "src/lib/supabase/supabaseApi";
import { z } from "zod";

const bodySchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

const SESSION_ERROR_MESSAGE =
  "We couldn't complete sign-in right now. Please request a new link.";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const parsed = bodySchema.safeParse(req.body || {});
  if (!parsed.success) {
    res.status(400).json({ error: SESSION_ERROR_MESSAGE });
    return;
  }

  const supabase = supabaseApi(req, res);
  const { error } = await supabase.auth.setSession(parsed.data);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to set auth session from callback:", error);
    res.status(400).json({ error: SESSION_ERROR_MESSAGE });
    return;
  }

  res.status(200).json({ ok: true });
}
