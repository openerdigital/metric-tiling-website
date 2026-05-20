import { cn } from "@helpers/cn";
import { Icon } from "@primitives";
import React from "react";

interface IProps {
  onClick?: () => void;
  direction?: "left" | "right";
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  style?: any;
}

const Arrow = React.forwardRef(
  (
    {
      onClick,
      direction = "left",
      className,
      ariaLabel,
      disabled,
      style, // ...props
    }: IProps,
    ref: any
  ) => {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          "group/arrow flex items-center justify-center duration-150",
          "icon-color-(--Arrow-Icon) hover:icon-color-(--Arrow-IconHover)",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30",
          className
        )}
        onClick={onClick}
        ref={ref}
        style={style}
      >
        <Icon
          name="arrow_right_square_filled"
          className={cn(
            "size-38 md:size-42",
            direction === "left" && "scale-[-1]"
          )}
        />
      </button>
    );
  }
);

export default Arrow;
