import { useEffect, useRef, useState } from "react";

export function useAutoplay<T>(items: T[], interval = 5000, start = true) {
  const [current, setCurrent] = useState<T>(items[0]);
  const intervalRef = useRef<number | null>(null);

  const clearTicker = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTicker = () => {
    if (!start) return; // 🔥 controlled by new prop
    if (items.length < 2) return;

    intervalRef.current = window.setInterval(() => {
      setCurrent((prev) => {
        const i = items.indexOf(prev);
        const next = i >= 0 ? (i + 1) % items.length : 0;
        return items[next];
      });
    }, interval);
  };

  // Start/stop autoplay based on items, interval, and start prop
  useEffect(() => {
    clearTicker();
    if (start) startTicker(); // only start if allowed
    return clearTicker;
  }, [items, interval, start]);

  // Manual setter resets timer if autoplay is active
  const setManually = (item: T) => {
    clearTicker();
    setCurrent(item);
    if (start) startTicker(); // only restart if autoplay enabled
  };

  const index = Math.max(0, items.indexOf(current));

  return {
    current,
    currentIndex: index,
    setManually,
  };
}
