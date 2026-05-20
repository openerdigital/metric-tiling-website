import { useRouter } from "next/router";
import { useEffect } from "react";

declare global {
  interface Window {
    instgrm: any;
  }
}

const useExternalScripts = () => {
  const router = useRouter();

  useEffect(() => {
    const enableExternalScripts = () => {
      document
        .querySelectorAll("script[data-original-src]")
        .forEach((placeholder) => {
          const src = placeholder.getAttribute("data-original-src");

          // Remove existing scripts with the same src
          document
            .querySelectorAll(`script[src="${src}"]`)
            .forEach((existingScript) => {
              existingScript.remove();
            });

          // Create and append the new script
          const newScript = document.createElement("script");
          newScript.src = src ?? "";
          newScript.type = "text/javascript";

          // Copy other attributes
          Array.from(placeholder.attributes).forEach((attr) => {
            if (attr.name !== "data-original-src") {
              newScript.setAttribute(attr.name, attr.value);
            }
          });

          // Reset any global variables that the script may have set
          if (window.instgrm) {
            delete window.instgrm;
          }

          document.body.appendChild(newScript);
        });
    };

    enableExternalScripts(); // On initial load
    router.events.on("routeChangeComplete", enableExternalScripts); // On route change

    return () => {
      router.events.off("routeChangeComplete", enableExternalScripts);
    };
  }, [router.events]);
};

export default useExternalScripts;
