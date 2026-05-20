import { cn } from "@helpers/cn";
import { useInView } from "@helpers/useInView";
import { Button, Image } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

const FiftyFiftyCTA = ({
  image,
  heading,
  subheading,
  paragraph,
  button,
  buttonHref = "#contact",
  imagePosition = "left",
}: {
  image?: string;
  heading?: string;
  subheading?: string;
  paragraph?: string;
  button?: string;
  buttonHref?: string;
  imagePosition?: "left" | "right";
}) => {
  const { ref: viewRef, inView } = useInView({ offset: "-150px" });

  return (
    <div
      ref={viewRef}
      className={cn(
        "bg-(--FiftyFiftyCTA-Bg) group relative grid sm:grid-cols-2 md:items-center"
      )}
    >
      <AnimatePresence>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={inView && { x: 0, opacity: 1 }}
          transition={{ type: "spring", mass: 5, damping: 50 }}
          className={cn(
            "px-initGutter flex flex-col items-center gap-2 py-4 text-center",
            "mc:pl-mainColumnGutter sm:items-start sm:px-6 sm:py-8 sm:text-left",
            "md:my-7 md:mr-10 md:gap-3"
          )}
        >
          {heading && (
            <h3 className="typography-h3 text-(--FiftyFiftyCTA-Heading)">
              {heading}
            </h3>
          )}
          {subheading && (
            <p className="typography-bodyLarge text-(--FiftyFiftyCTA-Subheading)">
              {subheading}
            </p>
          )}
          {paragraph && <p>{paragraph}</p>}
          <Button href={buttonHref} className="mt-1 md:mt-2">
            {button}
          </Button>
        </motion.div>
      </AnimatePresence>

      <Image
        src={image}
        alt={heading || "Feature image"}
        sizes="(max-width: 639px) 100vw, 50vw"
        className={cn(
          "-order-1 mx-auto aspect-[1.5] w-full sm:aspect-auto sm:h-full",
          imagePosition === "right" && "sm:order-2"
        )}
      />
    </div>
  );
};

export default FiftyFiftyCTA;
