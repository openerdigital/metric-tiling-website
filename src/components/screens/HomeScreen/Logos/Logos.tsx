import { slugify } from "@helpers/slugify";
import { Image } from "@primitives";
import React from "react";
import Marquee from "react-fast-marquee";

import { ComponentHeading } from "../style";

const Logos = ({
  navigationLabel,
  heading,
  variant = "marquee",
  items,
}: {
  navigationLabel: string;
  heading?: string;
  items?: { image: string }[];
  variant?: "grid" | "marquee";
}) => {
  if (!items?.length) return null;

  const renderImages = () =>
    items.map((item, index) => {
      if (!item?.image) return null;
      return (
        <Image
          key={index}
          src={item.image}
          alt={`Client logo ${index + 1}`}
          className="w-150"
          inheritSize
          sizes="150px"
        />
      );
    });

  return (
    <div id={slugify(navigationLabel)} className="overflow-hidden">
      {heading && (
        <ComponentHeading className="main-column text-center">
          {heading}
        </ComponentHeading>
      )}

      {variant === "grid" && (
        <div className="main-column flex flex-wrap justify-center gap-3 md:gap-5">
          {renderImages()}
        </div>
      )}

      {variant === "marquee" && <Marquee autoFill>{renderImages()}</Marquee>}
    </div>
  );
};

export default Logos;
