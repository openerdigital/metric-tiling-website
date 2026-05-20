import { createClient } from "@supabase/supabase-js";

import { publicEnv } from "../env/public";
import { serverEnv } from "../env/server";

export function supabaseService() {
  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY
  );
}
