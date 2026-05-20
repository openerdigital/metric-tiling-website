import { cn } from "@helpers/cn";

export const ComponentHeading = ({
  className,
  children,
}: {
  className?: string;
  children?: any;
}) => {
  return (
    <h2 className={cn("typography-h3 main-column mb-2 md:mb-5", className)}>
      {children}
    </h2>
  );
};
