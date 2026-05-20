import { cn } from "@helpers/cn";
import { useInView } from "@helpers/useInView";
import { Button, Image } from "@primitives";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import React from "react";

const FullWidthBanner2 = ({
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
  textAlign?: "left" | "center" | "right";
}) => {
  const { ref: viewRef, inView } = useInView({ offset: "-150px" });

  const { scrollYProgress } = useScroll({
    target: viewRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1]);

  return (
    <section className="relative overflow-hidden" ref={viewRef}>
      <div className="main-column md:py-160 py-8">
        <AnimatePresence>
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={inView && { y: 0, opacity: 1 }}
            transition={{ type: "spring", mass: 4, damping: 40 }}
            className={cn(
              "max-w-600 shadow-strong relative z-10 w-full rounded-3xl",
              "bg-(--FullWidthBanner2-CardBg) p-6",
              "md:p-10",
              textAlign === "center" && "mx-auto text-center",
              textAlign === "right" && "ml-auto"
            )}
          >
            {heading && (
              <h3 className="typography-h2 text-(--FullWidthBanner2-Heading)">
                {heading}
              </h3>
            )}
            {subheading && (
              <p className="typography-bodyLarge text-(--FullWidthBanner2-Subheading) mt-2">
                {subheading}
              </p>
            )}
            {paragraph && (
              <p className="text-(--FullWidthBanner2-Body) mt-3">{paragraph}</p>
            )}
            {button && (
              <Button
                href={buttonHref}
                className="mt-4 md:mt-5"
                variant="secondary"
              >
                {button}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div style={{ y, scale }} className="absolute inset-0">
          <Image
            src={image}
            className="absolute-full"
            decorative
            sizes="100vw"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FullWidthBanner2;
