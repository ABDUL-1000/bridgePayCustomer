import { ChildrenProps } from "@/shared-types";
import clsx from "clsx";
export interface TextProps extends ChildrenProps {
  className?: string;
}

export const Heading1 = ({ children, className }: TextProps) => (
  <h1
    className={clsx(["text-black-900 font-extrabold text-[56px]", className])}
  >
    {children}
  </h1>
);

export const Heading2 = ({ children, className }: TextProps) => (
  <h2
    className={clsx([
      "text-black-900 font-bold text-3xl md:text-[38px] lg:text-[48px]",
      className,
    ])}
  >
    {children}
  </h2>
);

export const Heading3 = ({ children, className }: TextProps) => (
  <h3
    className={clsx([
      "text-black-900 font-medium text-[32px] lg:text-[40px]",
      className,
    ])}
  >
    {children}
  </h3>
);

export const Heading4 = ({ children, className }: TextProps) => (
  <h4
    className={clsx([
      "text-black-900 font-medium text-2xl md:text-[26px] lg:text-[32px]",
      className,
    ])}
  >
    {children}
  </h4>
);

export const Heading5 = ({ children, className }: TextProps) => (
  <h5
    className={clsx([
      "text-black-900 font-medium text-xl md:text-[24px]",
      className,
    ])}
  >
    {children}
  </h5>
);

export const Heading6 = ({ children, className }: TextProps) => (
  <h6 className={clsx(["text-black-900 font-medium text-[20px]", className])}>
    {children}
  </h6>
);

export const SubHeading = ({ children, className }: TextProps) => (
  <h4 className={clsx(["font-medium text-[8px] md:text-[12px]", className])}>
    {children}
  </h4>
);

export const ParagraphXl4 = ({ children, className }: TextProps) => (
  <p className={clsx(["font-medium text-xl sm:text-[24px]", className])}>
    {children}
  </p>
);

export const ParagraphXl3 = ({ children, className }: TextProps) => (
  <p className={clsx(["font-medium text-[22px]", className])}>{children}</p>
);

export const ParagraphXl2 = ({ children, className }: TextProps) => (
  <p className={clsx(["font-medium text-[20px]", className])}>{children}</p>
);

export const ParagraphXl = ({ children, className }: TextProps) => (
  <p className={clsx(["text-base md:text-[18px]", className])}>{children}</p>
);

export const ParagraphLg = ({ children, className }: TextProps) => (
  <p className={clsx(["text-sm sm:text-[16px]", className])}>{children}</p>
);

export const ParagraphMd = ({ children, className }: TextProps) => (
  <p className={clsx(["text-xs md:text-sm", className])}>{children}</p>
);

export const ParagraphSm = ({ children, className }: TextProps) => (
  <p className={clsx(["text-[12px]", className])}>{children}</p>
);

export const ParagraphXs = ({ children, className }: TextProps) => (
  <p className={clsx(["text-[10px]", className])}>{children}</p>
);

export const ParagraphXlBold = ({ children, className }: TextProps) => (
  <p className={clsx(["font-bold text-[24px]", className])}>{children}</p>
);

export const ParagraphXlSemiBold = ({ children, className }: TextProps) => (
  <p className={clsx(["font-semibold text-[24px]", className])}>{children}</p>
);

export const Text = ({ children, className }: TextProps) => (
  <p
    className={clsx(["text-neutral-subtle font-normal text-[16px]", className])}
  >
    {children}
  </p>
);

export const TextSm = ({ children, className }: TextProps) => (
  <p
    className={clsx(["text-neutral-subtle font-normal text-[12px]", className])}
  >
    {children}
  </p>
);

export const InsideText = ({ children, className }: TextProps) => (
  <p
    className={clsx([
      "text-white font-medium text-[12px] leading-5",
      className,
    ])}
  >
    {children}
  </p>
);
