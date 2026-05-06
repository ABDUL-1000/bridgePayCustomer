import React from "react";
import Image from "next/image";

export interface CustomImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  priority?: boolean;
  fill?: boolean;
  className?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  width,
  height,
  style,
  priority,
  fill,
  className,
}) => (
  <Image
    src={src}
    alt={alt}
    width={0}
    height={0}
    sizes="100vw"
    priority={priority}
    quality={"100"}
    className={className}
    style={{
      position: "relative",
      width: fill ? "100%" : `${width}px`,
      height: height ? `${height}px` : "auto",
      ...style,
    }}
  />
);

export default CustomImage;
