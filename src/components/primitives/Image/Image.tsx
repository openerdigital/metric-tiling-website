import { cn } from "@helpers/cn";
import Img from "next/image";
import React from "react";

export interface IProps {
  inheritSize?: boolean;
  className?: string;
  style?: any;
  id?: string;
  src?: string;
  placeholderImage?: string;
  alt?: string;
  decorative?: boolean;
  priority?: boolean;
  displayPlaceholderImage?: boolean;
  quality?: number;
  sizes?: string;
  fadeInOnLoad?: boolean;
  children?: any;
  unoptimized?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
}

function Image({
  inheritSize,
  className,
  style,
  src,
  displayPlaceholderImage = false,
  placeholderImage = "/images/placeholder-image.jpg",
  alt = "",
  decorative = false,
  quality,
  priority = false,
  sizes,
  fadeInOnLoad = true,
  onClick,
  children,
  id,
  unoptimized = false,
}: IProps) {
  if (!displayPlaceholderImage && !src) return null;
  const resolvedAlt = decorative ? "" : alt.trim() || "Content image";

  return (
    <figure
      className={cn(
        `avImage relative object-cover`,
        inheritSize && "[&>img]:relative! [&>img]:h-auto!",
        className
      )}
      style={style}
      id={id}
    >
      <Img
        src={src || placeholderImage}
        alt={resolvedAlt}
        fill
        priority={priority}
        sizes={sizes}
        quality={quality}
        onLoad={(e: any) =>
          fadeInOnLoad && e.target.classList.remove("opacity-0")
        }
        onClick={onClick}
        className={cn(
          "rounded-[inherit]",
          fadeInOnLoad && "opacity-0 duration-300"
        )}
        unoptimized={unoptimized}
        aria-hidden={decorative}
        style={{
          objectFit: "inherit",
        }}
      />
      {children}
    </figure>
  );
}

export default Image;
