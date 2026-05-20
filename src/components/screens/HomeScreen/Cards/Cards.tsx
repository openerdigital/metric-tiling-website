import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { useInView } from "@helpers/useInView";
import { Arrow, Image } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Item } from "src/types/types";

import { ComponentHeading } from "../style";
import { useSliderScroll } from "./useSliderScroll";

export type CardVariant = "contained" | "overlay" | "split" | "glass";
export type WrapperVariant = "slider" | "grid";

type CardsProps = {
  navigationLabel: string;
  heading: string;
  items: Item[];
  cardVariant?: CardVariant;
  wrapperVariant?: WrapperVariant;
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
}: CardsProps) => {
  const CardComponent = getVariant(cardVariant);
  const wrapperVariantClass = getWrapperVariantClass(wrapperVariant);

  const { containerRef, arrowProps } = useSliderScroll({
    scrollAmount: 500,
  });

  const { ref: viewRef, inView } = useInView({ offset: "-150px" });

  return (
    <AnimatePresence>
      <section
        id={slugify(navigationLabel)}
        ref={viewRef}
        className="overflow-hidden"
      >
        <ComponentHeading className="-mb-3 flex items-center gap-2 md:mb-0 md:gap-4">
          {heading}

          {wrapperVariant === "slider" && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Arrows {...arrowProps} />
            </motion.div>
          )}
        </ComponentHeading>
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
      </section>
    </AnimatePresence>
  );
};

export default Cards;
