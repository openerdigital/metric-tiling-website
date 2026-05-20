import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import React from "react";

import { Logo } from "../NavBar/NavBar";

const Footer = ({
  navItems,
  configuration,
}: {
  navItems: string[];
  configuration: any;
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-(--Footer-Bg)">
      <div className="main-column flex flex-col items-center gap-3 py-5">
        <Logo className="text-(--Footer-Text) m-0" />

        <ul className="grid grid-cols-2 flex-wrap justify-center gap-2 gap-x-5 sm:flex">
          {navItems?.map((item: string, index: number) => {
            return (
              <li key={index}>
                <a href={`#${slugify(item)}`} className="group font-bold">
                  <span className="text-(--Footer-Text) relative">
                    {item}

                    <span
                      className={cn(
                        "bg-(--Footer-Underline) w-0",
                        "duration-260 absolute bottom-[-4px] left-0 h-[2px] ease-in-out group-hover:w-full"
                      )}
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="typography-bodySmall text-(--Footer-Text)">
          © {currentYear} {configuration.businessName}.{" "}
          {configuration.copyrightText}
        </p>
      </div>
    </div>
  );
};

export default Footer;
