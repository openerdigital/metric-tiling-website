import { cn } from "@helpers/cn";
import React from "react";

interface IProps {
  show?: boolean;
  errors?: any;
  name?: string;
  className?: string;
  message?: string;
  id?: string;
}

const ErrorMessage = ({
  show,
  errors,
  name,
  className,
  message,
  id,
}: IProps) => {
  const display = show || (errors && name && errors[name]);
  return (
    <p
      id={id}
      aria-live="polite"
      role={display ? "alert" : undefined}
      className={cn(
        "typography-footnote text-(--ContactForm-ErrorText) mt-2 font-bold",
        !display && "hidden",
        className
      )}
    >
      {message || (errors && name && errors[name]?.message)}
    </p>
  );
};

export default ErrorMessage;
