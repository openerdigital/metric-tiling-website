import { cn } from "@helpers/cn";
import React from "react";

const FormattedOptions = ({ className }: any) => {
  return (
    <div className={cn("mt-2 flex gap-4", className)}>
      <strong className="w-[45px]">Bold</strong>
      <a
        href="https://google.com"
        target="_blank"
        rel="noreferrer"
        className="typography-link w-[80px] lg:mr-[4px]"
      >
        Text link
      </a>

      <span className="text-(--Typography-bodyLinkHover) hidden font-bold md:block">
        Text link hover
      </span>
    </div>
  );
};

const typographyEg = () => {
  return (
    <div className="mx-auto max-w-[960px] px-[30px] py-[100px] lg:max-w-[1160px]">
      <p className="mb-8 border-b border-[#DDE3EA] pb-5 text-[#888A93]">
        Typography — <span className="lg:hidden">Mobile</span>{" "}
        <span className="hidden md:inline">Desktop</span>{" "}
      </p>
      <div className="grid grid-cols-[2fr_3fr] gap-[40px] md:grid-cols-2">
        {/* headings */}
        <div className="flex flex-col gap-[44px] lg:gap-[48px]">
          <p>Heading 1</p>
          <p>Heading 2</p>
          <p>Heading 3</p>
          <p>Heading 4</p>
          <p>Heading 5</p>
          <p>Heading 6</p>
          <p>Eyebrow</p>
        </div>

        <div className="flex w-[315px] flex-col gap-[40px] lg:w-[560px] lg:gap-[48px]">
          {/* Body */}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna.
          </p>
          <div>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.{" "}
            </p>
            <FormattedOptions />
          </div>
          <div>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.{" "}
            </p>
            <FormattedOptions className="typography-bodySmall" />
          </div>
          <div>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.{" "}
            </p>
            <FormattedOptions className="typography-footnote lg:pt-[4px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default typographyEg;
