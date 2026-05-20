import { useEffect, useRef, useState } from "react";

export function useInView(options: { offset?: string }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  const { offset, ...rest } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // trigger once
        }
      },
      {
        threshold: 0.2,
        rootMargin: `0px 0px ${offset} 0px`,
        ...rest,
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
