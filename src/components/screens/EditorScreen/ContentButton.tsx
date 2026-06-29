import { cn } from "@helpers/cn";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const contentButtonStyles = cva(
  [
    "typography-bodySmall inline-flex items-center justify-center rounded-[10px] border font-bold transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cms-form-ring)] focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:opacity-60",
  ],
  {
    variants: {
      variant: {
        add: [
          "border-[var(--color-cms-btn-add-border)]",
          "bg-[var(--color-cms-btn-add-bg)]",
          "text-[var(--color-cms-btn-add-text)]",
          "hover:bg-[var(--color-cms-btn-add-hover-bg)]",
        ],
        delete: [
          "border-[var(--color-cms-btn-delete-border)]",
          "bg-[var(--color-cms-btn-delete-bg)]",
          "text-[var(--color-cms-btn-delete-text)]",
          "hover:bg-[var(--color-cms-btn-delete-hover-bg)]",
        ],
        save: [
          "border-[var(--color-cms-btn-save-border)]",
          "bg-[var(--color-cms-btn-save-bg)]",
          "text-[var(--color-cms-btn-save-text)]",
          "hover:bg-[var(--color-cms-btn-save-hover-bg)]",
        ],
      },
      size: {
        default: "px-2 py-1",
        small: "text-[14px]! h-4 min-w-4 px-[6px]",
      },
    },
    defaultVariants: {
      variant: "save",
      size: "default",
    },
  }
);

type ContentButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof contentButtonStyles>;

export const ContentButton = React.forwardRef<
  HTMLButtonElement,
  ContentButtonProps
>(({ className, variant, size, type, ...props }, ref) => (
  <button
    ref={ref}
    type={type === "submit" ? "submit" : "button"}
    className={cn(contentButtonStyles({ variant, size }), className)}
    {...props}
  />
));

ContentButton.displayName = "ContentButton";
