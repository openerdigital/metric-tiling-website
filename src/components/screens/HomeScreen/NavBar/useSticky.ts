import { useEffect, useRef, useState } from "react";

type Options = {
  /** Don't do anything until scrollY >= startAt */
  startAt?: number;
  /** Minimum movement (px) required to toggle visibility */
  delta?: number;
  /** Initial visible state */
  initialVisible?: boolean;
  /**
   * If true: show on scroll down, hide on scroll up (your request).
   * If false: hide on scroll down, show on scroll up (common UX).
   */
  invert?: boolean;
};

export function useSticky({
  startAt = 120,
  delta = 12,
  initialVisible = false,
  invert = true,
}: Options = {}) {
  const [visible, setVisible] = useState(initialVisible);

  const lastYRef = useRef<number>(0);
  const lastToggleYRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);

  useEffect(() => {
    // Guard for SSR
    if (typeof window === "undefined") return;

    lastYRef.current = window.scrollY || 0;
    lastToggleYRef.current = lastYRef.current;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const lastY = lastYRef.current;

        // Determine direction
        const dir: "down" | "up" = y > lastY ? "down" : "up";

        // Only start after threshold
        if (y < startAt) {
          setVisible(initialVisible);
          lastYRef.current = y;
          lastToggleYRef.current = y;
          tickingRef.current = false;
          return;
        }

        // Avoid tiny jitter toggles
        const movedSinceToggle = Math.abs(y - lastToggleYRef.current);
        if (movedSinceToggle < delta) {
          lastYRef.current = y;
          tickingRef.current = false;
          return;
        }

        // Your requested behavior (invert=true):
        // down => show, up => hide
        const nextVisible = invert ? dir === "down" : dir === "up";

        setVisible((prev) => {
          if (prev !== nextVisible) {
            lastToggleYRef.current = y;
            return nextVisible;
          }
          return prev;
        });

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener("scroll", onScroll);
  }, [startAt, delta, initialVisible, invert]);

  return visible;
}
