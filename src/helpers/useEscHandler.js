import { useEffect } from "react";

export const useEscHandler = (doSomething) => {
  // Alert if clicked on outside of element
  function escEvent(event) {
    if (event.keyCode === 27) {
      doSomething();
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("keydown", escEvent);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("keydown", escEvent);
    };
  });
};
