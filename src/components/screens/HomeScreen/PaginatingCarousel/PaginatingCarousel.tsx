import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { useInView } from "@helpers/useInView";
import { Arrow, Button, Image } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Item } from "src/types/types";

import { ComponentHeading } from "../style";

type PaginatingCarouselProps = {
  items: Item[];
  eyebrow?: string;
  button?: string;
  buttonHref?: string;
  className?: string;
  navigationLabel: string;
  heading: string;
};

const textMotion = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
  transition: { duration: 0.55, ease: "easeOut" },
} as const;

const textPanelMotion = {
  initial: "hidden",
  animate: "show",
  variants: {
    hidden: {},
    show: {
      transition: {
        delayChildren: 0.22,
        staggerChildren: 0.12,
      },
    },
  },
} as const;

const textItemMotion = {
  variants: {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  },
  transition: { duration: 0.45, ease: "easeOut" },
} as const;

const controlsMotion = {
  variants: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  transition: { duration: 0.45, ease: "easeOut" },
} as const;

const PaginatingCarousel = ({
  items,
  eyebrow = "Why Metric",
  button,
  buttonHref = "#contact",
  heading,
  className,
  navigationLabel,
}: PaginatingCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { ref: viewRef, inView } = useInView({ offset: "-150px" });
  const activeItem = items[selectedIndex] || items[0];

  if (!items?.length) return null;

  const goToPrevious = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === 0 ? items.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === items.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <section
      ref={viewRef}
      className={cn("overflow-hidden", className)}
      id={slugify(navigationLabel)}
    >
      {heading && <ComponentHeading>{heading}</ComponentHeading>}
      <div className="main-column bg-(--color-brandBackground) grid gap-3 md:grid-cols-[1.1fr_500px] md:gap-5">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView && { opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden"
        >
          <div className="flex">
            {items.map((item, index) => (
              <motion.div
                key={`${item.heading}-${index}`}
                animate={{ x: `${selectedIndex * -100}%` }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                className="min-w-full"
              >
                <Image
                  displayPlaceholderImage
                  src={item.image}
                  alt={item.heading || "Feature image"}
                  className={cn(
                    "bg-(--RotatingFeatures-ImageBg) aspect-[1.15] object-cover md:aspect-[1.3]",
                    index !== selectedIndex && "opacity-25"
                  )}
                  sizes="(max-width: 767px) 100vw, 54vw"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...textPanelMotion}
          animate={inView ? "show" : "hidden"}
          className="border-(--color-brandGreyDark) relative flex flex-col border p-3 md:w-[500px] md:p-5"
        >
          <div className="flex items-start justify-between gap-2">
            <motion.div {...textItemMotion}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeItem.heading}
                  {...textMotion}
                  className="grid gap-2"
                >
                  {eyebrow && (
                    <p className="typography-bodySmall text-(--Typography-Eyebrow) font-bold uppercase tracking-[0.12em]">
                      {eyebrow}
                    </p>
                  )}
                  {activeItem.heading && (
                    <h3 className="typography-h3 text-(--Typography-Heading)">
                      {activeItem.heading}
                    </h3>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              {...controlsMotion}
              className="absolute right-3 top-2 flex shrink-0 gap-1 md:right-5 md:top-4"
            >
              <Arrow onClick={goToPrevious} ariaLabel="Show previous item" />
              <Arrow
                direction="right"
                onClick={goToNext}
                ariaLabel="Show next item"
              />
            </motion.div>
          </div>

          {activeItem.paragraph && (
            <motion.div
              {...textItemMotion}
              className="border-(--color-brandGreyDark) mt-3 border-t pt-3 md:mt-5 md:pt-4"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeItem.paragraph}
                  {...textMotion}
                  className="text-(--Typography-Body)"
                >
                  {activeItem.paragraph}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          <motion.div
            {...controlsMotion}
            className="mt-auto flex flex-col gap-3 pt-5"
          >
            <div className="flex gap-1">
              {items.map((item, index) => (
                <button
                  key={`${item.heading}-dot-${index}`}
                  type="button"
                  aria-label={`Show ${item.heading || `item ${index + 1}`}`}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "bg-(--Testimonials-DotInactive) hover:bg-(--Testimonials-DotHover) h-[4px] flex-1 duration-200",
                    index === selectedIndex && "bg-(--Testimonials-DotActive)"
                  )}
                />
              ))}
            </div>

            {button && (
              <Button href={buttonHref} variant="secondary" className="w-full">
                {button}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaginatingCarousel;
