/* eslint-disable unused-imports/no-unused-imports */
import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { getActiveTypography } from "@styles/fonts";
import React from "react";
import defaultData from "src/lib/defaultData";

import { Accordion } from "./Accordion";
import { Cards } from "./Cards";
import { ContactForm } from "./ContactForm";
import { FiftyFiftyCTA } from "./FiftyFiftyCTA";
import { Footer } from "./Footer";
import { FullWidthBanner1, FullWidthBanner2 } from "./FullWidthBanner";
import { Hero } from "./Hero";
import { Logos } from "./Logos";
import { RotatingFeatures } from "./RotatingFeatures";
import { SideBySideCTA } from "./SideBySideCTA";
import { Testimonials } from "./Testimonials";

const HomeScreen = ({ content }: any) => {
  const safeContent = content ?? defaultData;
  const {
    configuration,
    hero,
    services,
    whyChooseUs,
    about,
    testimonials,
    logos,
    faqs,
    form,
    contactInfo,
    //
    feature1,
    feature2,
  } = safeContent;

  const navItems = [
    services.navigationLabel,
    whyChooseUs.navigationLabel,
    about.navigationLabel,
    testimonials.navigationLabel,
    logos.navigationLabel,
    faqs.navigationLabel,
    form.navigationLabel,
  ];

  const typography = getActiveTypography();

  const contactHref = `#${slugify(form.navigationLabel)}`;

  // Carousel Ideas
  // https://www.mockplus.com/blog/post/website-carousel
  // https://dribbble.com/search/carousel

  return (
    <div className={cn(typography.className, "font-body")}>
      <Hero
        navItems={navItems}
        {...hero}
        phone={contactInfo.phone}
        button1Href={`#${slugify(services.navigationLabel)}`}
        button2Href={contactHref}
      />
      <div className="md:gap-102 grid gap-5 pt-5 sm:gap-7 md:pt-10">
        <Cards {...services} wrapperVariant="slider" />
        <RotatingFeatures {...whyChooseUs} buttonHref={contactHref} />
        <SideBySideCTA
          {...about}
          imagePosition="left"
          buttonHref={contactHref}
        />
        <Testimonials {...testimonials} />
        <FiftyFiftyCTA
          imagePosition="right"
          buttonHref={contactHref}
          {...feature1}
        />
        <Logos {...logos} />
        <FullWidthBanner1 {...feature2} buttonHref={contactHref} />
        {/* <FullWidthBanner2 {...feature2} /> */}
        <Accordion {...faqs} />
        <ContactForm {...form} contactInfo={contactInfo} />
        {/* <SideBySideCTA {...feature2} imagePosition="right" /> */}
      </div>
      <Footer navItems={navItems} configuration={configuration} />
    </div>
  );
};

export default HomeScreen;
