import { useEffect, useRef, useState } from "react";

export const useSliderScroll = ({
  scrollAmount = 300,

  resetDependency,
}: {
  scrollAmount?: number;
  resetDependency?: any;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftDisabled, setLeftDisabled] = useState(true);
  const [rightDisabled, setRightDisabled] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const sideScroll = (direction: "left" | "right") => {
    const element = containerRef.current;
    if (!element) return;

    const scrollUnit = scrollAmount;
    const currentScrollAmount = element.scrollLeft;

    const currentIndex = Math.floor(currentScrollAmount / scrollUnit);
    const makeUpAmount =
      (currentIndex * scrollUnit - currentScrollAmount) *
      (direction === "left" ? -1 : 1);

    const distanceToMovePx = scrollUnit + makeUpAmount;
    const delta = direction === "left" ? -distanceToMovePx : distanceToMovePx;

    element.scrollTo({
      left: element.scrollLeft + delta,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const element = containerRef?.current;
    if (!element) return;
    element?.addEventListener("scroll", () => {
      const scrollAmmount = element?.scrollLeft;

      if (scrollAmmount === 0) {
        setLeftDisabled(true);
      } else {
        setLeftDisabled(false);
      }

      if (scrollAmmount >= element.scrollWidth - element.clientWidth - 4) {
        setRightDisabled(true);
      } else {
        setRightDisabled(false);
      }
    });
  }, []);

  // show arrows when hovering over container
  useEffect(() => {
    const element = containerRef?.current;
    const isScrollable = element && element.scrollWidth > element.clientWidth;

    if (isScrollable) {
      setShowArrows(true);
    }
  }, []);

  // reset scroll position on items update
  useEffect(() => {
    if (resetDependency) {
      const element = containerRef?.current;
      if (element) {
        element.scrollLeft = 0;
      }
    }
  }, [resetDependency]);

  return {
    containerRef,
    arrowProps: {
      showArrows,
      sideScroll,
      leftDisabled,
      rightDisabled,
    },
  };
};
