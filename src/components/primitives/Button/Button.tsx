import { cn } from "@helpers/cn";
import { AvenueLink, Icon } from "@primitives";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

import { IconProps } from "@primitives/Icon/Icon";

const buttonStyles = cva(
  [
    "typography-body group relative inline-flex items-center justify-center border-2 font-bold transition-colors duration-200",
    "disabled:pointer-events-none disabled:opacity-60",
    "[&_svg]:icon-color-current [&_svg]:duration-450",
  ],

  {
    variants: {
      variant: {
        primary: [
          "text-(--Button-PrimaryText)",
          "bg-(--Button-PrimaryBg)",
          "border-(--Button-PrimaryBorder)",
          "hover:bg-(--Button-PrimaryHoverBg)",
          "hover:border-(--Button-PrimaryHoverBorder)",
        ],
        secondary: [
          "bg-(--Button-SecondaryBg)",
          "border-(--Button-SecondaryBorder)",
          "text-(--Button-SecondaryText)",
          "hover:bg-(--Button-SecondaryHoverBg)",
          "hover:border-(--Button-SecondaryHoverBorder)",
          "hover:text-(--Button-SecondaryHoverText)",
        ],
        tertiary: [
          "text-(--Button-TertiaryText)",
          "bg-(--Button-TertiaryBg)",
          "border-(--Button-TertiaryBorder)",
          "hover:bg-(--Button-TertiaryHoverBg)",
          "hover:border-(--Button-TertiaryHoverBorder)",
        ],
        textLink: [
          "bg-transparent! p-0! border-none underline duration-150",
          "text-(--Typography-BodyLink) hover:text-(--Typography-BodyLinkHover) hover:no-underline",
        ],
      },
      size: {
        small: "typography-bodySmall gap-1 px-2 py-1 [&_svg]:size-2",
        standard:
          "gap-1 px-2 py-1 md:gap-2 md:px-3 md:py-2 [&_svg]:size-20 md:[&_svg]:size-3",
      },

      rounded: {
        true: "rounded-buttons",
      },
      transition: {
        iconTranslate: "hover:[&_svg]:translate-x-[4px]",
        iconScale: "hover:[&_svg]:scale-[1.25]",
      },

      iconPosition: {
        left: "flex-row-reverse justify-end",
        right: "flex-row",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "standard",
      rounded: false,
      iconPosition: "right",
      transition: "iconTranslate",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonStyles>;
interface IProps extends ButtonVariants {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string | null;
  type?: any;
  ariaLabel?: string;
  icon?: {
    position?: ButtonVariants["iconPosition"];
  } & IconProps;
  className?: string;
  disabled?: boolean;
  id?: string;
  ref?: any;
}

const Button = ({
  children,
  onClick,
  href,
  type,
  variant = "primary",
  size,
  transition,
  disabled,
  icon,
  className,
  ariaLabel,
  ref,
  ...rest
}: IProps) => {
  const renderAsLink = !onClick && type !== "submit";

  if (
    (renderAsLink && !href) ||
    (!renderAsLink && !onClick && type !== "submit") ||
    !children
  )
    return null;

  const Tag = renderAsLink ? AvenueLink : "button";

  return (
    <Tag
      ref={ref}
      disabled={disabled}
      href={href || "#"}
      onClick={onClick}
      className={cn(
        "focus-visible",
        buttonStyles({
          variant,
          size,
          iconPosition: icon?.position,
          transition,
        }),
        className
      )}
      aria-label={ariaLabel}
      type={type}
      {...rest}
    >
      <span>{children}</span>
      {(icon || variant !== "textLink") && (
        <Icon
          name="arrow_right_circle_filled"
          {...icon}
          className={cn(icon?.className)}
        />
      )}
    </Tag>
  );
};

export default Button;
