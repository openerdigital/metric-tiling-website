import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { useAutoplay } from "@helpers/useAutoplay";
import { useInView } from "@helpers/useInView";
import { Icon } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

type Alignment = "centered" | "left";
type Items = { quote?: string; author?: string }[];

const Testimonial = ({
  currentIndex,
  quote,
  author,
  alignment = "centered",
}: {
  currentIndex: number;
  quote?: string;
  author?: string;
  alignment?: Alignment;
}) => {
  const isLeft = alignment === "left";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={cn(
          "flex gap-3",
          isLeft
            ? "items-start text-left md:gap-4"
            : "flex-col items-center text-center"
        )}
      >
        <Icon
          name="quote"
          className={cn(
            "icon-color-(--Testimonials-QuoteIcon)",
            isLeft
              ? "md:size-105 mt-1 size-48 -translate-y-1/2 opacity-70"
              : "size-120"
          )}
        />

        <div
          className={cn(
            isLeft ? "grid gap-2 md:gap-3" : "flex flex-col items-center gap-3"
          )}
        >
          <p
            className={cn(
              "text-(--Testimonials-QuoteText) font-bold",
              isLeft ? "typography-h3" : "typography-h5"
            )}
          >
            {quote}
          </p>

          <div
            className={cn(
              "flex items-center font-bold",
              isLeft ? "" : "mt-1 w-full justify-center"
            )}
          >
            <div
              className={cn(
                "bg-(--Testimonials-AuthorDash) mr-2 h-px",
                isLeft ? "w-5" : "w-20"
              )}
            />
            <span className="typography-eyebrow text-(--Testimonials-AuthorText)">
              {author}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Dots = ({
  items,
  currentIndex,
  onChange,
  alignment = "centered",
}: {
  items: Items;
  currentIndex: number;
  onChange: (item: Items[number]) => void;
  alignment?: Alignment;
}) => {
  return (
    <div
      className={cn(
        "mt-3 flex items-center gap-2 md:mt-5",
        alignment === "centered" ? "mx-auto" : "mx-auto"
      )}
    >
      {items.map((_: any, index: number) => {
        const isActive = index === currentIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(items[index])}
            className={cn(
              "relative size-11 rounded-full transition duration-200",
              isActive
                ? "scale-120 bg-(--Testimonials-DotActive)"
                : "bg-(--Testimonials-DotInactive) hover:bg-(--Testimonials-DotHover)"
            )}
            aria-label={`Show testimonial ${index + 1}`}
            aria-pressed={isActive}
          >
            <span className="absolute-centered size-[calc(100%+16px)]" />
          </button>
        );
      })}
    </div>
  );
};

const Testimonials = ({
  navigationLabel,
  items,
  alignment = "left",
}: {
  navigationLabel: string;
  items: Items;
  alignment?: Alignment;
}) => {
  const { ref: viewRef, inView } = useInView({ offset: "-100px" });
  const isLeft = alignment === "left";

  const {
    current: activeTestimonial,
    currentIndex,
    setManually: setActiveTestimonial,
  } = useAutoplay(items, 6000, inView);

  return (
    <div
      ref={viewRef}
      id={slugify(navigationLabel)}
      className={cn(
        "main-column flex flex-col py-2 md:py-5",
        isLeft ? "md:max-w-[980px]" : "md:max-w-860 max-w-[80%]"
      )}
    >
      <Testimonial
        {...activeTestimonial}
        currentIndex={currentIndex}
        alignment={alignment}
      />
      <Dots
        items={items}
        currentIndex={currentIndex}
        onChange={setActiveTestimonial}
        alignment={alignment}
      />
    </div>
  );
};

export default Testimonials;
