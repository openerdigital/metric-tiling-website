import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { useInView } from "@helpers/useInView";
import { Arrow, Icon, Image } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Item } from "src/types/types";

import { ComponentHeading } from "../style";
import { useSliderScroll } from "./useSliderScroll";

export type CardVariant = "contained" | "overlay" | "split" | "glass" | "open";
export type WrapperVariant = "slider" | "grid";
export type ArrowStyle = "buttons" | "cursor";

type CardsProps = {
  navigationLabel: string;
  heading: string;
  items: Item[];
  cardVariant?: CardVariant;
  wrapperVariant?: WrapperVariant;
  arrowStyle?: ArrowStyle;
};

type ArrowsProps = {
  sideScroll: (direction: "left" | "right") => void;
  leftDisabled: boolean;
  rightDisabled: boolean;
  showArrows: boolean;
};

type VariantCardProps = {
  index: number;
  inView: boolean;
  image?: string;
  heading?: string;
  paragraph?: string;
};

type CursorDirection = "left" | "right";

type CursorState = {
  visible: boolean;
  direction: CursorDirection;
  disabled: boolean;
};

const Arrows = ({
  sideScroll,
  leftDisabled,
  rightDisabled,
  showArrows,
}: ArrowsProps) => {
  if (!showArrows) return null;

  return (
    <div className="flex gap-1">
      <Arrow onClick={() => sideScroll("left")} disabled={leftDisabled} />
      <Arrow
        onClick={() => sideScroll("right")}
        direction="right"
        disabled={rightDisabled}
      />
    </div>
  );
};

const CardsCursor = React.forwardRef<HTMLDivElement, { cursor: CursorState }>(
  ({ cursor }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 hidden size-64 items-center justify-center transition-opacity duration-150 will-change-transform md:flex",
          cursor.visible && !cursor.disabled && "opacity-100",
          cursor.visible && cursor.disabled && "opacity-30",
          !cursor.visible && "opacity-0"
        )}
        style={{ transform: "translate3d(-999px, -999px, 0)" }}
      >
        <Icon
          name="arrow_right_square_filled"
          className={cn(
            "icon-color-(--Arrow-Icon) size-58 md:size-64",
            cursor.direction === "left" && "scale-[-1]"
          )}
        />
      </div>
    );
  }
);

const ContainedCard = ({
  index,
  inView,
  image,
  heading,
  paragraph,
}: VariantCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.15, ease: "easeOut" }}
      className="md:w-400 shadow-soft bg-(--Cards-CardBg) w-[70%] shrink-0 sm:w-[40%]"
    >
      <Image
        displayPlaceholderImage
        src={image}
        alt={heading || "Service image"}
        className="aspect-[1.6] w-full"
        sizes="(max-width: 639px) 70vw, (max-width: 767px) 40vw, 400px"
      />
      <div className="flex flex-col gap-1 px-2 py-3 text-center md:px-4 md:py-3">
        {heading && (
          <h3 className="typography-h4 text-(--Cards-CardHeading)">
            {heading}
          </h3>
        )}
        {paragraph && <p className="text-(--Cards-CardText)">{paragraph}</p>}
      </div>
    </motion.article>
  );
};

const OpenCard = ({
  index,
  inView,
  image,
  heading,
  paragraph,
}: VariantCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: index * 0.15, ease: "easeOut" }}
      className="md:w-400 w-[70%] shrink-0 sm:w-[40%]"
    >
      <Image
        displayPlaceholderImage
        src={image}
        alt={heading || "Service image"}
        className="aspect-[1.6] w-full"
        sizes="(max-width: 639px) 70vw, (max-width: 767px) 40vw, 400px"
      />
      <div className="flex flex-col gap-1 px-1 py-3 text-center md:px-2 md:py-3">
        {heading && (
          <h3 className="typography-h4 text-(--Cards-OpenCardHeading)">
            {heading}
          </h3>
        )}
        {paragraph && (
          <p className="text-(--Cards-OpenCardText)">{paragraph}</p>
        )}
      </div>
    </motion.article>
  );
};

const OverlayCard = ({
  index,
  inView,
  image,
  heading,
  paragraph,
}: VariantCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12, ease: "easeOut" }}
      className="md:w-380 relative w-[72%] shrink-0 overflow-hidden rounded-2xl sm:w-[45%]"
    >
      <Image
        displayPlaceholderImage
        src={image}
        alt={heading || "Service image"}
        className="aspect-[0.87] w-full"
        sizes="(max-width: 639px) 72vw, (max-width: 767px) 45vw, 380px"
      />
      <div className="from-(--color-secondaryOne) via-(--color-secondaryOne)/50 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 md:p-5">
        {heading && (
          <h3 className="typography-h4 text-(--color-utilitarianOne)">
            {heading}
          </h3>
        )}
        {paragraph && (
          <p className="text-(--color-utilitarianSeven) typography-bodySmall">
            {paragraph}
          </p>
        )}
      </div>
    </motion.article>
  );
};

const SplitCard = ({
  index,
  inView,
  image,
  heading,
  paragraph,
}: VariantCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12, ease: "easeOut" }}
      className="md:w-460 shadow-soft w-[80%] shrink-0 overflow-hidden sm:w-[56%]"
    >
      <div className="grid h-full grid-cols-1 items-start sm:grid-cols-[40%_1fr]">
        <Image
          displayPlaceholderImage
          src={image}
          alt={heading || "Service image"}
          className="aspect-auto h-full"
          sizes="(max-width: 639px) 80vw, (max-width: 767px) 56vw, 184px"
        />
        <div className="flex flex-col justify-center gap-2 p-4">
          {heading && <h3 className="typography-h5">{heading}</h3>}
          {paragraph && <p className="typography-bodySmall">{paragraph}</p>}
        </div>
      </div>
    </motion.article>
  );
};

const GlassCard = ({
  index,
  inView,
  image,
  heading,
  paragraph,
}: VariantCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.85, delay: index * 0.1, ease: "easeOut" }}
      className="md:w-380 relative w-[72%] shrink-0 overflow-hidden rounded-2xl sm:w-[48%]"
    >
      <Image
        displayPlaceholderImage
        src={image}
        alt={heading || "Service image"}
        className="aspect-[1.05] w-full md:aspect-[0.8]"
        sizes="(max-width: 639px) 72vw, (max-width: 767px) 48vw, 380px"
      />
      <div className="bg-(--color-utilitarianOne)/70 absolute inset-x-3 bottom-3 p-3 backdrop-blur-sm">
        {heading && (
          <h3 className="typography-h4 text-(--color-secondaryOne)">
            {heading}
          </h3>
        )}
        {paragraph && (
          <p className="typography-bodySmall mt-1 md:mt-2">{paragraph}</p>
        )}
      </div>
    </motion.article>
  );
};

const getVariant = (
  cardVariant: CardVariant
): React.ComponentType<VariantCardProps> => {
  switch (cardVariant) {
    case "split":
      return SplitCard;
    case "glass":
      return GlassCard;
    case "overlay":
      return OverlayCard;
    case "open":
      return OpenCard;
    case "contained":
    default:
      return ContainedCard;
  }
};

const getWrapperVariantClass = (wrapperVariant: WrapperVariant) => {
  switch (wrapperVariant) {
    case "grid":
      return cn(
        "main-column grid grid-cols-1 gap-3 overflow-visible sm:grid-cols-2 md:grid-cols-3",
        "*:shrink! *:w-full!"
      );
    case "slider":
    default:
      return cn(
        "px-initGutter sm:px-smGutter mc:pl-mainColumnGutter",
        "flex flex-nowrap gap-2 overflow-auto md:gap-4"
      );
  }
};

const Cards = ({
  navigationLabel,
  heading,
  items,
  cardVariant = "contained",
  wrapperVariant = "slider",
  arrowStyle = "buttons",
}: CardsProps) => {
  const CardComponent = getVariant(cardVariant);
  const wrapperVariantClass = getWrapperVariantClass(wrapperVariant);

  const { containerRef, arrowProps } = useSliderScroll({
    scrollAmount: 500,
  });

  const { ref: viewRef, inView } = useInView({ offset: "-150px" });
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const cursorFrameRef = React.useRef<number | null>(null);
  const cursorStateRef = React.useRef<CursorState>({
    visible: false,
    direction: "right",
    disabled: false,
  });
  const [cursor, setCursor] = React.useState<CursorState>(
    cursorStateRef.current
  );

  const cursorEnabled = wrapperVariant === "slider" && arrowStyle === "cursor";
  const showCursor = cursorEnabled && arrowProps.showArrows;

  const updateCursorState = React.useCallback((nextState: CursorState) => {
    const {
      disabled: currentDisabled,
      direction: currentDirection,
      visible: currentVisible,
    } = cursorStateRef.current;

    if (
      currentVisible === nextState.visible &&
      currentDirection === nextState.direction &&
      currentDisabled === nextState.disabled
    ) {
      return;
    }

    cursorStateRef.current = nextState;
    setCursor(nextState);
  }, []);

  const updateCursorPosition = React.useCallback((x: number, y: number) => {
    if (cursorFrameRef.current) {
      cancelAnimationFrame(cursorFrameRef.current);
    }

    cursorFrameRef.current = requestAnimationFrame(() => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${x - 32}px, ${
        y - 32
      }px, 0)`;
    });
  }, []);

  const getCursorDirection = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>): CursorDirection => {
      const rect = event.currentTarget.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;

      return cursorX < rect.width / 2 ? "left" : "right";
    },
    []
  );

  const isCursorDirectionDisabled = React.useCallback(
    (direction: CursorDirection) => {
      return direction === "left"
        ? arrowProps.leftDisabled
        : arrowProps.rightDisabled;
    },
    [arrowProps.leftDisabled, arrowProps.rightDisabled]
  );

  const supportsCursorPointer = React.useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;

    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const handleCursorMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!showCursor || !supportsCursorPointer()) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const direction = getCursorDirection(event);

      updateCursorPosition(event.clientX - rect.left, event.clientY - rect.top);
      updateCursorState({
        visible: true,
        direction,
        disabled: isCursorDirectionDisabled(direction),
      });
    },
    [
      getCursorDirection,
      isCursorDirectionDisabled,
      showCursor,
      supportsCursorPointer,
      updateCursorPosition,
      updateCursorState,
    ]
  );

  const hideCursor = React.useCallback(() => {
    updateCursorState({ ...cursorStateRef.current, visible: false });
  }, [updateCursorState]);

  const handleCursorClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!showCursor || !supportsCursorPointer()) return;

      const direction = getCursorDirection(event);
      if (isCursorDirectionDisabled(direction)) return;

      arrowProps.sideScroll(direction);
    },
    [
      arrowProps,
      getCursorDirection,
      isCursorDirectionDisabled,
      showCursor,
      supportsCursorPointer,
    ]
  );

  const handleCursorKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!showCursor) return;

      if (event.key === "ArrowLeft" && !arrowProps.leftDisabled) {
        event.preventDefault();
        arrowProps.sideScroll("left");
      }

      if (event.key === "ArrowRight" && !arrowProps.rightDisabled) {
        event.preventDefault();
        arrowProps.sideScroll("right");
      }
    },
    [arrowProps, showCursor]
  );

  React.useEffect(() => {
    return () => {
      if (cursorFrameRef.current) {
        cancelAnimationFrame(cursorFrameRef.current);
      }
    };
  }, []);

  const cardsContent = (
    <div ref={containerRef} className={cn("py-5", wrapperVariantClass)}>
      {items.map((item, index) => (
        <CardComponent
          key={`${index}-${item.heading || "card"}`}
          {...item}
          index={index}
          inView={inView}
        />
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      <section
        id={slugify(navigationLabel)}
        ref={viewRef}
        className={cn("overflow-hidden", cursorEnabled && "relative")}
      >
        <ComponentHeading className="-mb-3 flex items-center gap-2 md:mb-0 md:gap-4">
          {heading}

          {wrapperVariant === "slider" && arrowStyle === "buttons" && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Arrows {...arrowProps} />
            </motion.div>
          )}
        </ComponentHeading>

        {cursorEnabled ? (
          <div
            role="button"
            tabIndex={showCursor ? 0 : -1}
            onClick={handleCursorClick}
            onKeyDown={handleCursorKeyDown}
            onMouseLeave={hideCursor}
            onMouseMove={handleCursorMove}
            className={cn("relative", showCursor && "md:cursor-none")}
          >
            {cardsContent}
            {showCursor && <CardsCursor ref={cursorRef} cursor={cursor} />}
          </div>
        ) : (
          cardsContent
        )}
      </section>
    </AnimatePresence>
  );
};

export default Cards;
