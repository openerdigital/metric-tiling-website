import type { User } from "@supabase/supabase-js";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { serverEnv } from "src/lib/env/server";
import { supabaseApi } from "src/lib/supabase/supabaseApi";
import { supabaseServer } from "src/lib/supabase/supabaseServer";
import { supabaseService } from "src/lib/supabase/supabaseService";

export type ClientEditorRole = "owner" | "editor";

type RequireClientEditorOk = {
  ok: true;
  user: User;
  role: ClientEditorRole;
};

type RequireClientEditorFail = {
  ok: false;
  status: 401 | 403 | 500;
  error: string;
};

export type RequireClientEditorResult =
  | RequireClientEditorOk
  | RequireClientEditorFail;

type RequireClientEditorInput =
  | { ctx: GetServerSidePropsContext; clientId?: string }
  | { req: NextApiRequest; res: NextApiResponse; clientId?: string };

export async function requireClientEditor(
  input: RequireClientEditorInput
): Promise<RequireClientEditorResult> {
  const clientId = input.clientId ?? serverEnv.CLIENT_ID;
  const supabase =
    "ctx" in input
      ? supabaseServer(input.ctx)
      : supabaseApi(input.req, input.res);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { ok: false, status: 401, error: "Authentication failed" };
  }

  if (!user) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  if (serverEnv.ADMIN_USER_ID && user.id === serverEnv.ADMIN_USER_ID) {
    return { ok: true, user, role: "owner" };
  }

  const service = supabaseService();
  const { data, error } = await service
    .from("clients")
    .select("allowed_editor_ids")
    .eq("client_id", clientId)
    .contains("allowed_editor_ids", [user.id])
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, error: "Editor authorization failed" };
  }

  if (!data) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, user, role: "editor" };
}
