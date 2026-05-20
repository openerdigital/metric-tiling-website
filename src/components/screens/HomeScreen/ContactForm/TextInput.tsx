import { cn } from "@helpers/cn";
import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";

import ErrorMessage from "./ErrorMessage";

export const Label = ({
  name,
  isActive,
  children,
}: {
  name?: string;
  isActive?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <label
      htmlFor={name}
      className={cn(
        "bg-(--ContactForm-SectionBg) duration-240 pointer-events-none absolute left-2 top-2 px-1 font-bold",
        isActive &&
          "typography-footnote text-(--ContactForm-LabelActiveText) -top-1"
      )}
    >
      {children}
    </label>
  );
};

const TextInput = ({
  label,
  name,
  type = "text",
  className,
  value,
  onChange,
  errors,
  register,
}: {
  label?: string;
  name: string;
  type?: string;
  className?: string;
  value?: string;
  onChange?: any;
  errors?: any;
  register?: UseFormRegister<any>;
}) => {
  const isTextArea = type === "textarea";
  const Input = isTextArea ? "textarea" : "input";
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState<string>("");
  const currentValue = value ?? localValue;
  const isActive = !!currentValue?.length || focused;
  const errorId = `${name}-error`;
  const hasError = !!(errors && errors[name]);

  const sharedProps = {
    id: name,
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? errorId : undefined,
    className: cn(
      "ring-(--ContactForm-InputBorderDefault) peer w-full px-2 py-2 outline-none ring-1 duration-200 md:px-3",
      isTextArea && "h-150",
      isActive && "ring-(--ContactForm-InputBorderActive) ring-2"
    ),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  const rhfProps: any =
    register?.(name, {
      onChange: (e) => {
        setLocalValue(e.target.value);
        onChange?.(e);
      },
      onBlur: () => setFocused(false),
    }) ?? {};

  const bindRHFRef = (node: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (typeof rhfProps.ref === "function") rhfProps.ref(node);
    else if (rhfProps.ref) rhfProps.ref.current = node;

    if (node) setLocalValue(node.value || "");
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type={isTextArea ? undefined : type}
        {...sharedProps}
        {...rhfProps}
        ref={register ? bindRHFRef : undefined}
        // For standalone controlled use
        {...(!register && value !== undefined ? { value, onChange } : {})}
      />

      {label && (
        <Label name={name} isActive={isActive}>
          {label}
        </Label>
      )}
      <ErrorMessage errors={errors} name={name} id={errorId} />
    </div>
  );
};

export default TextInput;
