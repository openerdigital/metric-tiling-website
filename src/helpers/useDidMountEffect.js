import { useEffect, useRef } from "react";

// this is basically a useEffect, but doesnt get run on first mount
export const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (didMount.current) {
      return func();
    }
    didMount.current = true;
  }, deps);
};
