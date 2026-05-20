import { cn } from "@helpers/cn";
import React from "react";
import { UseFormRegister } from "react-hook-form";

export const Label = ({
  name,
  children,
  className,
}: {
  name?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <label htmlFor={name} className={cn("mb-1 font-bold", className)}>
      {children}
    </label>
  );
};

const ContentTextInput = ({
  label,
  name,
  type = "text",
  placeholder,
  className,
  value,
  onChange,
  errors: _errors,
  register,
  rows = 5,
}: {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  errors?: any;
  register?: UseFormRegister<any>;
  rows?: number;
}) => {
  const isTextArea = type === "textarea";
  const registration = register?.(name);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    registration?.onChange(e);
    onChange?.(e);
  };

  const fieldClassName =
    "typography-bodySmall w-full rounded-[10px] border border-[var(--color-cms-form-border)] bg-[var(--color-cms-form-input-bg)] px-2 py-[10px] text-[var(--color-cms-form-text)] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] transition-colors duration-200 placeholder:text-[var(--color-cms-form-placeholder)] focus-visible:border-[var(--color-cms-form-border-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-cms-form-ring)] focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className={cn("relative flex flex-col", className)}>
      {label && (
        <Label
          name={name}
          className="mb-[6px] text-[var(--color-cms-form-label)]"
        >
          {label}
        </Label>
      )}
      {isTextArea ? (
        <textarea
          id={name}
          name={registration?.name ?? name}
          ref={registration?.ref}
          onBlur={registration?.onBlur}
          onChange={handleChange}
          className={cn(fieldClassName, "min-h-20 resize-y")}
          value={value}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          id={name}
          name={registration?.name ?? name}
          ref={registration?.ref}
          onBlur={registration?.onBlur}
          onChange={handleChange}
          type={type}
          className={fieldClassName}
          value={value}
          placeholder={placeholder}
        />
      )}

      {/* <ErrorMessage errors={errors} name={name} /> */}
    </div>
  );
};

export default ContentTextInput;
