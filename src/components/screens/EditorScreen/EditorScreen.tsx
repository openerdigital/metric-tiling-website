import { cn } from "@helpers/cn";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { buildManifest } from "src/lib/buildManifest";
import defaultData from "src/lib/defaultData";

import { AutoContentForm } from "./AutoContentForm";
import RHSMenu from "./RHSMenu";

type EditorScreenProps = {
  content: any;
  userEmail: string | null;
};

const UNSAVED_CHANGES_MESSAGE =
  "Are you sure? Changes that you made may not be saved when leaving this page without saving.";

export default function EditorScreen({
  content,
  userEmail,
}: EditorScreenProps) {
  // const contentStr = JSON.stringify(content);
  // console.log("contentStr:", contentStr);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState,
    reset,
  } = useForm({
    defaultValues: content,
    // defaultValues: defaultData,
  });

  const manifest = useMemo(() => buildManifest(defaultData), [content]);

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!formState.isDirty) return;

      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = UNSAVED_CHANGES_MESSAGE;
    };

    const handleRouteChangeStart = () => {
      if (!formState.isDirty) return;

      if (window.confirm(UNSAVED_CHANGES_MESSAGE)) return;

      router.events.emit("routeChangeError");
      throw new Error("Route change aborted by user due to unsaved changes.");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [formState.isDirty, router.events]);

  const onSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/content/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: values,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        alert("Content update failed");

        console.error("Content update failed", {
          status: res.status,
          statusText: res.statusText,
          response: json,
        });
        return;
      }

      reset(values);
      console.log("Content updated successfully", json);
      if (json?.revalidated) {
        alert("Content updated and site cache refreshed");
      } else {
        alert(
          `Content updated, but site cache refresh failed${
            json?.revalidateError ? `: ${json.revalidateError}` : "."
          }`
        );
      }
    } catch (err) {
      alert("Content update request error");

      console.error("Content update request error", err);
    }
  };
  return (
    <form
      className="main-column max-w-1300 relative py-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className={cn(
          "md:grid md:grid-cols-[1fr_auto] md:items-start md:gap-5"
        )}
      >
        <div>
          <h1 className="typography-h2 pb-2 text-black underline md:pb-4">
            Content Management System
          </h1>
          <AutoContentForm
            manifest={manifest}
            control={control}
            register={register}
            setValue={setValue}
            getValues={getValues}
          />
        </div>

        <RHSMenu
          manifest={manifest}
          isSubmitting={formState.isSubmitting}
          userEmail={userEmail}
        />
      </div>
    </form>
  );
}
