import { cn } from "@helpers/cn";
import { Icon } from "@primitives";
import * as Select from "@radix-ui/react-select";
import * as React from "react";
import { useController } from "react-hook-form";

import ErrorMessage from "./ErrorMessage";
import { Label } from "./TextInput";

const BaseSelectInput = React.forwardRef(
  (
    {
      label = "Choose an option",
      name,
      value,
      errorMessage,
      defaultValue,
      onValueChange,
      onChange,
      options = ["Option One", "Option Two", "Option Three"],
    }: {
      label: string;
      name?: string;
      value?: string;
      defaultValue?: string;
      errorMessage?: string;
      onValueChange?: (next: string) => void;
      onChange?: (next: string) => void;
      options?: string[];
    },
    ref: any
  ) => {
    const hasError = !!errorMessage;
    const [isOpen, setIsOpen] = React.useState(false);
    const isActive = !!value || isOpen;
    const errorId = name ? `${name}-error` : undefined;

    return (
      <div>
        <Select.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange || onChange}
          name={name}
          aria-label={name}
          onOpenChange={setIsOpen}
        >
          <Select.Trigger
            name={name}
            aria-label={label}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            className={cn(
              "ring-(--ContactForm-InputBorderDefault) relative flex w-full justify-between px-3 py-2 outline-0 ring-1",
              isActive &&
                "ring-(--ContactForm-InputBorderActive) border-none font-normal ring-2"
            )}
            ref={ref}
          >
            <Label isActive={isActive}>{label}</Label>

            <Select.Value />
            <Select.Icon>
              <Icon
                name="chevron_right"
                className={cn("size-3", isOpen ? "-rotate-90" : "rotate-90")}
              />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              position="popper"
              sideOffset={8}
              className="w-(--radix-select-trigger-width) bg-(--ContactForm-SelectBg)"
            >
              <Select.Viewport>
                {options.map((opt) => (
                  <Select.Item
                    key={opt}
                    value={opt}
                    className={cn(
                      "cursor-pointer px-3 py-16",
                      "hover:bg-(--ContactForm-SelectOptionHoverBg) hover:text-(--ContactForm-SelectOptionHoverText)",
                      "data-[state=checked]:bg-(--ContactForm-SelectOptionHoverBg) data-[state=checked]:text-white"
                    )}
                  >
                    <Select.ItemText>{opt}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <ErrorMessage show={hasError} message={errorMessage} id={errorId} />
      </div>
    );
  }
);

const SelectInput = (props: any) => {
  const { control, name, defaultValue, ...rest } = props;
  if (control && name) {
    const {
      field: { onChange, value, ref },
      fieldState: { error },
      // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useController({
      name,
      control,
      defaultValue,
    });

    return (
      <BaseSelectInput
        onValueChange={onChange}
        ref={ref}
        value={value}
        errorMessage={error?.message}
        defaultValue={defaultValue}
        name={name}
        {...rest}
      />
    );
  }
  return <BaseSelectInput {...props} />;
};

export default SelectInput;
