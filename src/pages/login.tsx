import { requireClientEditor } from "src/lib/auth/requireClientEditor";
import { supabaseServer } from "src/lib/supabase/supabaseServer";

import { LoginScreen } from "@screens/LoginScreen";

export default function Login({ initialError }: { initialError?: string }) {
  return <LoginScreen initialError={initialError} />;
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = supabaseServer(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const access = await requireClientEditor({ ctx });

    if (access.ok) {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }

    await supabase.auth.signOut();

    return {
      props: {
        initialError:
          "You're signed in, but this account doesn't have access to this CMS.",
      },
    };
  }

  return { props: {} };
};
