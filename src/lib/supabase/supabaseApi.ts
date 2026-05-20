import {
  type CookieOptions,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";

import { publicEnv } from "../env/public";

function isSecureCookieRequest(req: NextApiRequest) {
  if (process.env.NODE_ENV === "production") return true;
  const proto = req.headers["x-forwarded-proto"];
  if (typeof proto === "string") return proto.includes("https");
  if (Array.isArray(proto)) return proto.some((p) => p.includes("https"));
  return false;
}

function cookieOptions(
  req: NextApiRequest,
  options: CookieOptions = {}
): CookieOptions {
  return {
    ...options,
    secure: isSecureCookieRequest(req) ? true : options.secure,
  };
}

function appendSetCookie(res: NextApiResponse, cookie: string) {
  const prev = res.getHeader("Set-Cookie");

  if (!prev) {
    res.setHeader("Set-Cookie", cookie);
  } else if (Array.isArray(prev)) {
    res.setHeader("Set-Cookie", [...prev, cookie]);
  } else {
    res.setHeader("Set-Cookie", [prev as string, cookie]);
  }
}

export function supabaseApi(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? "").map(
            ({ name, value }) => ({
              name,
              value: value ?? "",
            })
          );
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            appendSetCookie(
              res,
              serializeCookieHeader(name, value, cookieOptions(req, options))
            );
          });
        },
      },
    }
  );
}
