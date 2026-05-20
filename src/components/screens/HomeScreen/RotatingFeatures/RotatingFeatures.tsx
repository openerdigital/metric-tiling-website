import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { useAutoplay } from "@helpers/useAutoplay";
import { useInView } from "@helpers/useInView";
import { Button, Icon, Image } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Item } from "src/types/types";

import { ComponentHeading } from "../style";

const List = ({ items, setSelectedItem, selectedItem, inView }: any) => {
  return (
    <div
      className={cn("flex shrink-0 flex-nowrap overflow-auto", "md:flex-col")}
    >
      {items.map((item: Item, index: number) => {
        const active = selectedItem.heading === item.heading;
        return (
          <AnimatePresence key={`${item.heading}-${index}`}>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.17,
                ease: "easeOut",
              }}
              key={index}
              onClick={() => setSelectedItem(item)}
              className={cn(
                "py-13 px-2 md:pl-3",
                "duration-250 hover:bg-(--RotatingFeatures-ItemHoverBg) group flex shrink-0 items-center text-left font-bold",
                active &&
                  "bg-(--RotatingFeatures-ItemActiveBg)! text-(--RotatingFeatures-ItemActiveText)!"
              )}
            >
              {item.heading}
              <Icon
                name="chevron_right"
                className={cn(
                  "ml-auto hidden size-4 duration-150 group-hover:opacity-20 md:block",
                  active ? "opacity-100!" : "opacity-0"
                )}
              />
            </motion.button>
          </AnimatePresence>
        );
      })}
    </div>
  );
};

const ImageSection = ({ selectedItem, inView }: any) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={inView && { opacity: 1, x: 0 }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
        className="h-full"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={selectedItem.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3 }}
            className={cn(
              "bg-(--RotatingFeatures-ImageBg) relative aspect-[1.5]",
              "md:min-h-550 md:aspect-auto md:h-full"
            )}
          >
            <Image
              displayPlaceholderImage
              className="absolute-full"
              src={selectedItem.image}
              alt={selectedItem.heading || "Feature image"}
              sizes="(max-width: 767px) 100vw, 45vw"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const TextSection = ({
  selectedItem,
  inView,
  button,
  buttonHref,
}: {
  selectedItem: any;
  inView: boolean;
  button?: string;
  buttonHref: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={inView && { opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedItem.heading}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.65 }}
          className="p-5 md:p-7"
        >
          <h3 className="typography-h4 mb-2">{selectedItem.heading}</h3>
          <p>{selectedItem.paragraph}</p>
          {button && (
            <Button href={buttonHref} className="mt-3">
              {button}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const RotatingFeatures = ({
  navigationLabel,
  heading,
  items,
  button,
  buttonHref = "#contact",
}: {
  navigationLabel: string;
  heading: string;
  items: Item[];
  button?: string;
  buttonHref?: string;
}) => {
  const { ref: viewRef, inView } = useInView({ offset: "-150px" });

  const { current: selectedItem, setManually: setSelectedItem } = useAutoplay(
    items,
    6000,
    inView
  );
  return (
    <div id={slugify(navigationLabel)} className="overflow-hidden">
      {heading && <ComponentHeading>{heading}</ComponentHeading>}
      <div
        ref={viewRef}
        className={cn(
          inView ? "bg-(--RotatingFeatures-Bg)" : "bg-transparent",
          "delay-1000 duration-1000",
          "md:main-column grid md:grid-cols-[1.5fr_2.7fr_2.3fr]"
        )}
      >
        <List
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
          inView={inView}
          items={items}
        />

        <ImageSection selectedItem={selectedItem} inView={inView} />

        <TextSection
          selectedItem={selectedItem}
          inView={inView}
          button={button}
          buttonHref={buttonHref}
        />
      </div>
    </div>
  );
};

export default RotatingFeatures;
