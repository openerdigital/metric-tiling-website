import {
  type CookieOptions,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { GetServerSidePropsContext } from "next";
import { publicEnv } from "src/lib/env/public";

function isSecureCookieRequest(ctx: GetServerSidePropsContext) {
  if (process.env.NODE_ENV === "production") return true;
  const proto = ctx.req.headers["x-forwarded-proto"];
  if (typeof proto === "string") return proto.includes("https");
  if (Array.isArray(proto)) return proto.some((p) => p.includes("https"));
  return false;
}

function cookieOptions(
  ctx: GetServerSidePropsContext,
  options: CookieOptions = {}
): CookieOptions {
  return {
    ...options,
    secure: isSecureCookieRequest(ctx) ? true : options.secure,
  };
}

function appendSetCookie(ctx: GetServerSidePropsContext, cookie: string) {
  const prev = ctx.res.getHeader("Set-Cookie");

  if (!prev) {
    ctx.res.setHeader("Set-Cookie", cookie);
  } else if (Array.isArray(prev)) {
    ctx.res.setHeader("Set-Cookie", [...prev, cookie]);
  } else {
    ctx.res.setHeader("Set-Cookie", [prev as string, cookie]);
  }
}

export function supabaseServer(ctx: GetServerSidePropsContext) {
  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(ctx.req.headers.cookie ?? "").map(
            ({ name, value }) => ({
              name,
              value: value ?? "",
            })
          );
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            appendSetCookie(
              ctx,
              serializeCookieHeader(name, value, cookieOptions(ctx, options))
            );
          });
        },
      },
    }
  );
}
