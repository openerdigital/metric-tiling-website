import { cn } from "@helpers/cn";
import { Image } from "@primitives";
import React from "react";

type ImageOrVideoProps = {
  src?: string;
  className?: string;
  style?: React.CSSProperties;
  inheritSize?: boolean;
  displayPlaceholderImage?: boolean;
  sizes?: string;
  alt?: string;
  decorative?: boolean;
  quality?: number;
  poster?: string;
  videoPreload?: "none" | "metadata" | "auto";
};

const ImageOrVideo = ({
  src,
  className,
  style,
  alt,
  inheritSize,
  displayPlaceholderImage,
  sizes,
  quality,
  decorative = false,
  poster,
  videoPreload = "metadata",
}: ImageOrVideoProps) => {
  if (!src) return null;

  const clean = src.split("?")[0].split("#")[0].toLowerCase();
  const isVideo = /\.(mp4|webm|mov|m4v|ogg)$/.test(clean);

  if (isVideo) {
    return (
      <video
        className={cn(className, "rounded-[inherit] object-cover")}
        autoPlay
        loop
        muted
        playsInline
        preload={videoPreload}
        poster={poster}
        aria-label={decorative ? undefined : alt || "Content video"}
        aria-hidden={decorative}
      >
        <source src={src} />
      </video>
    );
  }

  return (
    <Image
      src={src}
      className={className}
      style={style}
      inheritSize={inheritSize}
      displayPlaceholderImage={displayPlaceholderImage}
      sizes={sizes}
      alt={alt}
      decorative={decorative}
      quality={quality}
    />
  );
};

export default ImageOrVideo;
