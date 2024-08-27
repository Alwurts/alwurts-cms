"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface HoverImageProps extends Omit<ImageProps, 'src'> {
  defaultSrc: string;
  hoverSrc: string;
}

export function HoverImage({ defaultSrc, hoverSrc, alt, ...props }: HoverImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Image
      src={isHovered ? hoverSrc : defaultSrc}
      alt={alt}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    />
  );
}