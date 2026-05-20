import type { SupabaseClient } from "@supabase/supabase-js";

import { siteContentSchema } from "./contentSchema";
import { serverEnv } from "./env/server";

export type SiteContentRow = {
  content: unknown; // or your actual Content type
};

export async function getSiteContent(
  supabase: SupabaseClient
): Promise<SiteContentRow["content"] | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("content")
    .eq("client_id", serverEnv.CLIENT_ID)
    .single();

  if (error || !data) return null;

  const parsed = siteContentSchema.safeParse(data.content);
  if (!parsed.success) return null;

  return parsed.data;
}
