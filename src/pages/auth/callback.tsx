import type { EmailOtpType } from "@supabase/supabase-js";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabaseServer } from "src/lib/supabase/supabaseServer";

const CALLBACK_ERROR_MESSAGE =
  "This sign-in link is invalid or has expired. Please request a new one.";
const MISSING_AUTH_TOKEN_ERROR_MESSAGE =
  "This sign-in link is incomplete. Please request a new one.";
const SUPPORTED_OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function getRedirectTarget(raw: string | string[] | undefined) {
  if (typeof raw !== "string" || !raw) return "/admin";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  return raw;
}

type AuthCallbackPageProps = {
  error: string | null;
  next: string;
  shouldHandleHash: boolean;
};

function getAuthCode(ctx: GetServerSidePropsContext) {
  return typeof ctx.query.code === "string" ? ctx.query.code : null;
}

function getTokenHash(ctx: GetServerSidePropsContext) {
  return typeof ctx.query.token_hash === "string" ? ctx.query.token_hash : null;
}

function getOtpType(ctx: GetServerSidePropsContext) {
  const type = typeof ctx.query.type === "string" ? ctx.query.type : null;

  if (!type || !SUPPORTED_OTP_TYPES.has(type as EmailOtpType)) {
    return null;
  }

  return type as EmailOtpType;
}

export default function AuthCallbackPage({
  error: initialError,
  next,
  shouldHandleHash,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [error, setError] = useState(initialError);

  useEffect(() => {
    if (!shouldHandleHash) {
      return undefined;
    }

    let isActive = true;

    async function finalizeHashSession() {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const errorDescription =
        params.get("error_description") ?? params.get("error");

      if (hash) {
        const url = new URL(window.location.href);
        url.hash = "";
        window.history.replaceState(window.history.state, "", url.toString());
      }

      if (errorDescription) {
        if (isActive) {
          setError(errorDescription);
        }
        return;
      }

      if (!accessToken || !refreshToken) {
        if (isActive) {
          setError(MISSING_AUTH_TOKEN_ERROR_MESSAGE);
        }
        return;
      }

      try {
        const response = await fetch("/api/auth/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (isActive) {
            setError(payload.error || CALLBACK_ERROR_MESSAGE);
          }
          return;
        }

        await router.replace(next);
      } catch (sessionError) {
        // eslint-disable-next-line no-console
        console.error(
          "Failed to finish hash-based auth callback:",
          sessionError
        );

        if (isActive) {
          setError(CALLBACK_ERROR_MESSAGE);
        }
      }
    }

    finalizeHashSession();

    return () => {
      isActive = false;
    };
  }, [next, router, shouldHandleHash]);

  const status = error ? "We couldn't sign you in." : "Finalizing sign-in...";

  return (
    <main className="main-column max-w-540 my-5">
      <h1 className="typography-h3 mb-2">Auth Callback</h1>
      <p>{status}</p>
      {error ? <p className="mt-2 text-[red]">{error}</p> : null}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<
  AuthCallbackPageProps
> = async (ctx) => {
  const code = getAuthCode(ctx);
  const tokenHash = getTokenHash(ctx);
  const type = getOtpType(ctx);
  const next = getRedirectTarget(ctx.query.next);
  const supabase = supabaseServer(ctx);

  if (!code && !(tokenHash && type)) {
    return {
      props: {
        error: null,
        next,
        shouldHandleHash: true,
      },
    };
  }

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        token_hash: tokenHash as string,
        type: type as EmailOtpType,
      });

  if (error) {
    const message = code
      ? "Failed to exchange auth code for session:"
      : "Failed to verify auth callback token:";

    // eslint-disable-next-line no-console
    console.error(message, error);

    return {
      props: {
        error: CALLBACK_ERROR_MESSAGE,
        next,
        shouldHandleHash: false,
      },
    };
  }

  return {
    redirect: {
      destination: next,
      permanent: false,
    },
  };
};
