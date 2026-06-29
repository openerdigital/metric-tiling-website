import { cn } from "@helpers/cn";
import { useInView } from "@helpers/useInView";
import { Button, Image } from "@primitives";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import React from "react";

const FullWidthBanner1 = ({
  image,
  heading,
  subheading,
  paragraph,
  button,
  buttonHref = "#contact",
  textAlign = "left",
}: {
  image: string;
  heading?: string;
  subheading?: string;
  paragraph?: string;
  button?: string;
  buttonHref?: string;
  textAlign?: "left" | "center";
}) => {
  const { ref: viewRef, inView } = useInView({ offset: "-150px" });

  const { scrollYProgress } = useScroll({
    target: viewRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div className="relative" ref={viewRef}>
      <div className="main-column flex">
        <AnimatePresence>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={inView && { x: 0, opacity: 1 }}
            transition={{ type: "spring", mass: 5, damping: 50 }}
            style={{ y }}
            className={cn(
              "max-w-700 md:py-200 relative z-10 py-8",
              "flex flex-col items-start gap-2 md:gap-3",
              textAlign === "center" && "mx-auto items-center text-center"
            )}
          >
            {heading && (
              <h3 className="typography-h2 text-(--FullWidthBanner1-Heading)">
                {heading}
              </h3>
            )}
            {subheading && (
              <p className="typography-bodyLarge text-(--FullWidthBanner1-SubHeading)">
                {subheading}
              </p>
            )}
            {paragraph && (
              <p className="text-(--FullWidthBanner1-Body)">{paragraph}</p>
            )}
            <Button
              href={buttonHref}
              className="mt-1 md:mt-2"
              variant="primary"
            >
              {button}
            </Button>
          </motion.div>
        </AnimatePresence>

        <Image src={image} className="absolute-full" decorative sizes="100vw" />

        <div
          className={cn(
            "bg-linear-to-r absolute left-0 top-0 h-full",
            "w-full from-black/60 to-black/20",
            "md:w-1/2 md:from-black/70 md:to-black/0",
            textAlign === "center" && "md:w-full md:to-black/20"
          )}
        />

        <div className={cn("absolute-full bg-black/30")} />
      </div>
    </div>
  );
};

export default FullWidthBanner1;
