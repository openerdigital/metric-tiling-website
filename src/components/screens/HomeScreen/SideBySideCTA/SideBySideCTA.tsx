import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { useInView } from "@helpers/useInView";
import { Button, Image } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

const MotionButton = motion.create(Button);
const SideBySideCTA = ({
  imagePosition = "left",
  //
  navigationLabel,
  image,
  heading,
  paragraph1,
  paragraph2,
  button,
  buttonHref = "#contact",
}: {
  navigationLabel: string;
  image?: string;
  heading?: string;
  paragraph1?: string;
  paragraph2?: string;
  button?: string;
  buttonHref?: string;
  imagePosition?: "left" | "right";
}) => {
  const { ref: viewRef, inView } = useInView({ offset: "-150px" });

  return (
    <div
      ref={viewRef}
      id={slugify(navigationLabel)}
      className={cn(
        "main-column md:gap-120 grid gap-3 md:items-center",
        imagePosition === "left"
          ? "md:grid-cols-[3fr_4fr]"
          : "md:grid-cols-[4fr_3fr]"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-2 text-center",
          "md:items-start md:gap-3 md:text-left"
        )}
      >
        {heading && <h3 className="typography-h3">{heading}</h3>}

        {paragraph1 && <p className="typography-bodyLarge">{paragraph1}</p>}
        {paragraph2 && <p>{paragraph2}</p>}
        {button && (
          <MotionButton
            initial={{ opacity: 0, x: -15 }}
            animate={inView && { opacity: 1, x: 0 }}
            transition={{ type: "spring", mass: 4, damping: 50, delay: 0.3 }}
            href={buttonHref}
            className="mt-1 md:mt-2"
          >
            {button}
          </MotionButton>
        )}
      </div>
      <AnimatePresence>
        <motion.div
          className={cn(
            "max-w-300 relative -order-1 mx-auto aspect-square w-full",
            "md:aspect-[0.75] md:max-w-full",
            imagePosition === "right" && "md:order-2"
          )}
          initial={{ x: -20, opacity: 0 }}
          animate={inView && { x: 0, opacity: 1 }}
          transition={{ type: "spring", mass: 5, damping: 50 }}
        >
          <Image
            src={image}
            alt={heading || "About image"}
            className="absolute-full"
            sizes="(max-width: 767px) 100vw, 43vw"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SideBySideCTA;
