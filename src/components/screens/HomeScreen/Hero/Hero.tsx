import { cn } from "@helpers/cn";
import { Button, ImageOrVideo } from "@primitives";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { NavBar } from "../NavBar";
import { NavStyleVariant } from "../NavBar/NavBar";

// import { useSticky } from "../NavBar/useSticky";

const Hero = ({
  navStyleVariant = "overlay",
  align = "left",
  navItems,
  phone,
  businessName,
  //
  video,
  image,
  heading,
  paragraph,
  button1,
  button2,
  //
  button1Href,
  button2Href,
}: {
  align?: "left" | "center";
  navStyleVariant?: NavStyleVariant;
  navItems: string[];
  phone?: string;
  businessName?: string;
  video?: string;
  image?: string;
  heading?: string;
  paragraph?: string;
  button1: string;
  button2: string;
  button1Href: string;
  button2Href: string;
}) => {
  // const showSticky = useSticky({
  //   startAt: 200,
  //   delta: 16,
  // });

  return (
    <div className="bg-(--Hero-Bg) relative">
      <NavBar navItems={navItems} phone={phone} businessName={businessName} />
      {/* <NavBar
        navItems={navItems}
        variant="solid"
        phone={phone}
        className={cn(
          "z-100 duration-460 fixed top-0 ease-in-out",
          showSticky
            ? "shadow-strong visible translate-y-0"
            : "invisible -translate-y-full"
        )}
      /> */}

      <div className={cn(navStyleVariant === "solid" && "relative")}>
        <ImageOrVideo
          src={video || image}
          className="absolute-full"
          decorative
          videoPreload="auto"
          poster={image}
          sizes="100vw"
        />

        <div className="bg-linear-to-r absolute left-0 top-0 h-full w-full from-black/100 to-black/0 md:w-3/4" />
        <div className="bg-linear-to-b absolute left-0 top-0 h-1/4 w-full from-black/80 to-black/0" />
        <AnimatePresence>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="main-column sm:py-160 md:py-190 lg:py-270 pt-90 huge:py-330 pb-5"
          >
            {/* Text Section */}
            <div
              className={cn(
                "lg:max-w-800 max-w-700 text-(--Hero-Text) relative grid gap-2 md:gap-3",
                align === "center" &&
                  "max-w-900 mx-auto justify-center text-center"
              )}
            >
              {heading && (
                <h1 className="typography-h1 text-(--Hero-Text)">{heading}</h1>
              )}
              {paragraph && <p>{paragraph}</p>}
              <div
                className={cn(
                  "mt-1 flex flex-wrap gap-1 md:gap-2",
                  align === "center" && "justify-center"
                )}
              >
                {button1 && (
                  <Button href={button1Href} variant="secondary">
                    {button1}
                  </Button>
                )}
                {button2 && <Button href={button2Href}>{button2}</Button>}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Hero;
