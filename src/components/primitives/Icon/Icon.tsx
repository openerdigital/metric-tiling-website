import { cn } from "@helpers/cn";

import * as icons from "./icons/_icons.export";

export type IconNameOptions = keyof typeof icons;

export interface IconProps {
  name: IconNameOptions;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  const defaultSize =
    !className?.includes("size-") && !className?.includes("w-") ? "size-3" : "";
  const renderedIcon = icons[name];

  const SVG = renderedIcon;
  if (!renderedIcon) return <p className="text-[red]">invalid-icon</p>;
  return <SVG className={cn(`block shrink-0 ${defaultSize}`, className)} />;
};

export default Icon;
