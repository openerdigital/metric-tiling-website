import { useRouter } from "next/router";
import { useEffect } from "react";

export const useScript = (src: string) => {
  const router = useRouter();

  useEffect(() => {
    const loadScript = () => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process(); // Initialize embeds
          }
        };
      } else {
        // If script exists, reprocess Instagram embeds
        // eslint-disable-next-line no-lonely-if
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      }
    };

    // Load the script on initial mount
    loadScript();

    const handleRouteChange = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process(); // Reprocess on route change
      }
    };

    // Reprocess embeds after navigation
    router.events.on("routeChangeComplete", handleRouteChange);

    // Cleanup the event listener
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, src]);
};
