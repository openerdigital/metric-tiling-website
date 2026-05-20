import { Icon } from "@primitives";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ContentButton } from "@screens/EditorScreen/ContentButton";
import ContentTextInput from "@screens/EditorScreen/ContentTextInput";

const LoginScreen = ({ initialError }: { initialError?: string }) => {
  const [error, setError] = useState<string | null>(initialError || null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({});

  // eslint-disable-next-line consistent-return
  const onSubmit = async (data: any) => {
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/auth/request-login-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return setError(
        payload.error || "We couldn't send a sign-in link. Please try again."
      );
    }

    setSuccess("If this email has access, a login link has been sent.");
  };

  return (
    <main className="main-column max-w-540 my-5">
      <h1 className="typography-h3 mb-2">Login</h1>
      <p className="mb-2">
        Enter your email and we&apos;ll send you a secure sign-in link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
        <ContentTextInput
          type="email"
          name="email"
          label="Email"
          register={register}
        />
        <ContentButton
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          <span className="inline-flex items-center gap-2">
            Send Login Link
            {isSubmitting && <Icon name="spinner" className="size-3" />}
          </span>
        </ContentButton>
      </form>

      {error && <p className="mt-2 text-[red]">{error}</p>}
      {success && <p className="mt-2 text-[green]">{success}</p>}
    </main>
  );
};

export default LoginScreen;
