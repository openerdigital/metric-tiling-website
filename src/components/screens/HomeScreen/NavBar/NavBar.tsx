import { cn } from "@helpers/cn";
import { slugify } from "@helpers/slugify";
import { useHash } from "@helpers/useHash";
import { useMedia } from "@helpers/useMedia";
import { AvenueLink, Button, Icon, Image } from "@primitives";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { lock, unlock } from "tua-body-scroll-lock";

export const Logo = ({
  className,
  variant,
}: {
  className?: string;
  variant?: NavStyleVariant;
}) => {
  return (
    <a
      href="/"
      className={cn("hover-opacity mr-auto block shrink-0 md:mr-0", className)}
      aria-label="Metric Tiling SA home"
    >
      <Image
        src="/images/metric-tiling-logo.png"
        alt="Metric Tiling SA"
        inheritSize
        className={cn(
          "w-140 md:w-170 object-contain",
          variant === "overlay" && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
        )}
      />
    </a>
  );
};

const MobileNav = ({
  setOpen,
  navItems,
  businessName,
}: {
  setOpen?: any;
  navItems: string[];
  businessName?: string;
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed left-0 top-0 size-full bg-black"
      />
      <motion.div
        id="mobile-menu"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="bg-(--NavBar-MobileBg) fixed left-0 top-0 z-20 h-screen w-full overflow-auto md:hidden"
      >
        <div className="main-column flex items-center justify-between pt-3">
          <Logo variant="overlay" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="cross" className="icon-color-white size-4" />
          </button>
        </div>
        <ul className="px-initGutter sm:px-smGutter flex flex-col py-3 pt-5 text-center">
          {navItems?.map((item, index) => {
            return (
              <li key={index}>
                <AvenueLink
                  href={`#${slugify(item)}`}
                  className="typography-eyebrow block py-2 text-[20px] font-bold text-white"
                >
                  {item}
                </AvenueLink>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </>
  );
};

const Hamburger = ({ open, setOpen, variant }: any) => {
  const lineStyles = cn(
    "bg-(--NavBar-HamburgerLine) block h-[2px] w-full",
    variant === "overlay" && "bg-(--NavBar-HamburgerLineOverlay)"
  );
  return (
    <button
      className="md:hidden"
      type="button"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <div className="flex h-3 w-4 flex-col justify-between">
        <span className={lineStyles} />
        <span className={lineStyles} />
        <span className={lineStyles} />
      </div>
    </button>
  );
};

const PhoneButton = ({
  number,
  variant,
}: {
  number?: string;
  variant?: NavStyleVariant;
}) => {
  return (
    <>
      <a href={`tel:${number}`} className="md:order-4 lg:hidden">
        <Icon
          name="phone_filled"
          className={cn(
            "size-28",
            variant === "overlay" && "icon-color-(--NavBar-OverlayIcon)"
          )}
        />
      </a>
      <Button
        href={`tel:${number}`}
        className={cn(
          "px-1! py-1! gap-1! order-4 hidden lg:flex",
          variant === "overlay" && "text-(--NavBar-ItemText)"
        )}
        transition="iconTranslate"
        icon={{ name: "phone", position: "left", className: "!size-3" }}
      >
        {number}
      </Button>
    </>
  );
};

const DesktopNav = ({
  variant,
  navItems,
}: {
  variant?: NavStyleVariant;
  navItems: string[];
}) => {
  return (
    <ul
      className={cn(
        "typography-bodySmall hidden md:flex",
        variant === "overlay" && "text-(--NavBar-ItemText)"
      )}
    >
      {navItems?.map((item, index) => {
        return (
          <li key={index}>
            <AvenueLink
              href={`#${slugify(item)}`}
              className="group px-2 py-1 font-bold"
            >
              <span className="relative mr-auto text-[16px]">
                {item}

                <span
                  className={cn(
                    "bg-(--NavBar-ItemUnderline) w-0",
                    "duration-260 absolute bottom-[-4px] left-0 h-[2px] ease-in-out group-hover:w-full"
                  )}
                />
              </span>
            </AvenueLink>
          </li>
        );
      })}
    </ul>
  );
};

export type NavStyleVariant = "solid" | "overlay";

const NavBar = ({
  variant = "overlay",
  navItems,
  phone,
  className,
  businessName,
}: {
  variant?: NavStyleVariant;
  navItems: string[];
  className?: string;
  phone?: string;
  businessName?: string;
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMedia(["(min-width: 1024px)"], [true], false);

  useHash(() => {
    setOpen(false);
  });

  useEffect(() => {
    if (open) {
      lock();
    } else {
      unlock();
    }
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [isDesktop]);

  return (
    <>
      <nav
        className={cn(
          "z-20 w-full",
          variant === "overlay" ? "absolute" : "bg-(--NavBar-SolidBg) relative",
          className
        )}
      >
        <div
          className={cn(
            "main-column flex items-center gap-3",
            variant === "overlay" ? "py-3 lg:py-4" : "lg:py-18 py-2"
          )}
        >
          <Logo variant={variant} />

          {phone && <PhoneButton number={phone} variant={variant} />}
          <Hamburger variant={variant} open={open} setOpen={setOpen} />
          <DesktopNav variant={variant} navItems={navItems} />
        </div>
        <AnimatePresence>
          {open && (
            <MobileNav
              setOpen={setOpen}
              navItems={navItems}
              businessName={businessName}
            />
          )}
        </AnimatePresence>
      </nav>

      {/* pushes down masthead on overlay variant */}
      {variant === "overlay" && <div className="pb-8" />}
    </>
  );
};

export default NavBar;
