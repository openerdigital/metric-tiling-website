import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { Icon } from "@primitives";
import * as RadixAccordion from "@radix-ui/react-accordion";
import HTMLReactParser from "html-react-parser";
import React from "react";

import { ComponentHeading } from "../style";

const AccordionItem = ({ value, question, answer }: any) => {
  return (
    <RadixAccordion.Item
      value={value}
      className={cn(
        "[&:is(:last-child)>div]:rounded-b-inherit not-last:border-b group",
        "border-(--Accordion-ItemBorder)"
      )}
    >
      <RadixAccordion.Header className="bg-(--Accordion-HeaderBg) text-(--Accordion-HeaderText)">
        <RadixAccordion.Trigger className="group flex w-full items-center justify-between">
          <h3 className={cn("p-2 text-left font-bold md:p-3")}>{question}</h3>
          <Icon
            name="arrow_right"
            className={cn(
              "mr-2 duration-300 md:mr-3",
              "icon-color-(--Accordion-Icon) group-data-[state=open]:rotate-90"
            )}
          />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content
        className={cn(
          "overflow-hidden",
          "data-[state=open]:animate-openRadixAccordion",
          "data-[state=closed]:animate-closeRadixAccordion",
          "bg-(--Accordion-ContentBg)"
        )}
      >
        {/* wysiwyg wrapper */}
        <div
          className={cn(
            `wysiwyg typography-bodySmall p-2 md:p-3`
            // "text-(--Accordion-accordionText)",
            // "[&_a]:text-(--Accordion-accordionTextLink)!",
            // "[&_a:hover]:text-(--Accordion-accordionTextLink)!"
          )}
        >
          {answer && HTMLReactParser(answer)}
        </div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  );
};

const Accordion = ({
  navigationLabel,
  heading,
  items,
}: {
  navigationLabel: string;
  heading?: string;
  items: {
    question: string;
    answer: string;
  }[];
}) => {
  return (
    <div id={slugify(navigationLabel)} className="main-column max-w-800">
      {heading && (
        <ComponentHeading className="text-center">{heading}</ComponentHeading>
      )}
      <RadixAccordion.Root
        type="multiple"
        className={cn("border-(--Accordion-RootBorder) border")}
      >
        {items?.map((item, index) => {
          return (
            <AccordionItem
              {...item}
              key={index}
              value={`${item?.question}-${index}`}
            />
          );
        })}
      </RadixAccordion.Root>
    </div>
  );
};

export default Accordion;
