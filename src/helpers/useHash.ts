import { useRouter } from "next/router";
import { useEffect } from "react";

const getHash = (url: string) => {
  const hash = url.substring(url.indexOf("#"));

  return hash;
};

export const useHash = (fn: (hash: string) => any | null) => {
  const router = useRouter();

  useEffect(() => {
    // check hash on mount
    const initPath = router.asPath;
    const initHash: string = getHash(initPath);

    if (initHash) {
      fn(initHash);
    }

    // handle hash change
    const handleHashChange = (url: string) => {
      const hash: string = getHash(url);

      fn(hash);
    };

    router.events.on("hashChangeStart", handleHashChange);

    return () => {
      router.events.off("hashChangeStart", handleHashChange);
    };
  }, []);
};
