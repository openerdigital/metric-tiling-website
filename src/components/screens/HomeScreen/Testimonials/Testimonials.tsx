import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { useAutoplay } from "@helpers/useAutoplay";
import { useInView } from "@helpers/useInView";
import { Icon } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

const Testimonial = ({ currentIndex, quote, author }: any) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={cn("flex flex-col items-center gap-3 text-center")}
      >
        <Icon
          name="quote"
          className="size-120 icon-color-(--Testimonials-QuoteIcon)"
        />

        <p className="typography-h5 text-(--Testimonials-QuoteText) font-bold">
          {quote}
        </p>

        <div className="flex items-center font-bold">
          <div className="bg-(--Testimonials-AuthorDash) mr-2 h-px w-20" />
          <span className="typography-eyebrow text-(--Testimonials-AuthorText)">
            {author}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Dots = ({ items, currentIndex, onChange }: any) => {
  return (
    <div className="mx-auto mt-3 flex items-center gap-2 md:mt-5">
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

type Items = { quote?: string; author?: string }[];

const Testimonials = ({
  navigationLabel,
  items,
}: {
  navigationLabel: string;
  items: Items;
}) => {
  const { ref: viewRef, inView } = useInView({ offset: "-100px" });

  const {
    current: activeTestimonial,
    currentIndex,
    setManually: setActiveTestimonial,
  } = useAutoplay(items, 6000, inView);

  return (
    <div
      ref={viewRef}
      id={slugify(navigationLabel)}
      className="main-column md:max-w-860 flex max-w-[80%] flex-col"
    >
      <Testimonial {...activeTestimonial} currentIndex={currentIndex} />
      <Dots
        items={items}
        currentIndex={currentIndex}
        onChange={setActiveTestimonial}
      />
    </div>
  );
};

export default Testimonials;
