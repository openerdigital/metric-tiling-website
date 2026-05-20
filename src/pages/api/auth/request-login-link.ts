import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { publicEnv } from "src/lib/env/public";
import { serverEnv } from "src/lib/env/server";
import { supabaseService } from "src/lib/supabase/supabaseService";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
});

const CLIENT_ACCESS_ERROR_MESSAGE =
  "We couldn't process your request right now. Please try again.";
const LOGIN_LINK_ERROR_MESSAGE =
  "We couldn't send a sign-in link right now. Please try again.";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getRequestOrigin(req: NextApiRequest) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  let proto = "http";

  if (typeof forwardedProto === "string") {
    proto = forwardedProto;
  } else if (process.env.NODE_ENV === "production") {
    proto = "https";
  }

  const host =
    typeof req.headers["x-forwarded-host"] === "string"
      ? req.headers["x-forwarded-host"]
      : req.headers.host;

  if (!host) {
    throw new Error("Missing request host");
  }

  return `${proto}://${host}`;
}

function supabasePasswordlessAuth() {
  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: "implicit",
        persistSession: false,
      },
    }
  );
}

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
    res.status(400).json({
      error: "Please enter a valid email address.",
    });
    return;
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const service = supabaseService();
  const { data: client, error: clientError } = await service
    .from("clients")
    .select("allowed_editor_emails")
    .eq("client_id", serverEnv.CLIENT_ID)
    .maybeSingle();

  if (clientError) {
    // eslint-disable-next-line no-console
    console.error("Failed to load client access:", clientError);
    res.status(500).json({ error: CLIENT_ACCESS_ERROR_MESSAGE });
    return;
  }

  const allowedEmails = (client?.allowed_editor_emails ?? []).map(
    normalizeEmail
  );
  const isAllowed = allowedEmails.includes(normalizedEmail);

  if (isAllowed) {
    // Send links without a PKCE-bound verifier so they can be opened in any
    // browser. The callback page completes the session using the returned hash
    // tokens or a token_hash-based template.
    const supabase = supabasePasswordlessAuth();
    const redirectUrl = new URL("/auth/callback", getRequestOrigin(req));
    redirectUrl.searchParams.set("next", "/admin");

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: redirectUrl.toString(),
      },
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to send login link:", error);
      res.status(500).json({ error: LOGIN_LINK_ERROR_MESSAGE });
      return;
    }
  }

  res.status(200).json({ ok: true });
}
