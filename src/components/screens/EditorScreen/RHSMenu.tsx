import { cn } from "@helpers/cn";
import { scrollTo } from "@helpers/scrollTo";
import { Icon } from "@primitives";
import React from "react";
import { labelFromKey } from "src/lib/inferFieldKind";

import { ContentButton } from "./ContentButton";
import { LogoutButton } from "./LogOutButton";

type RHSMenuProps = {
  isSubmitting: boolean;
  manifest: any[];
  userEmail: string | null;
};

const RHSMenu = ({ manifest, isSubmitting, userEmail }: RHSMenuProps) => {
  const [open, setOpen] = React.useState(true);
  const handleSectionClick = (path: string) => {
    scrollTo(path, "smooth");

    if (window.matchMedia("(max-width: 767px)").matches) {
      setOpen(false);
    }
  };

  return (
    <div
      className={cn(
        "shadow-soft fixed bottom-2 right-2 z-50",
        "w-[270px] rounded-[14px] border border-[var(--color-cms-sidebar-border)] bg-[var(--color-cms-sidebar-bg)]",
        "md:sticky md:top-3",
        "flex flex-col overflow-hidden"
      )}
    >
      <div className="border-b border-[var(--color-cms-sidebar-border)] bg-[var(--color-cms-sidebar-header-bg)] px-2 py-1">
        {userEmail && (
          <p className="typography-bodySmall mb-1 break-all px-1 font-bold text-[var(--color-cms-sidebar-header-text)] opacity-80">
            {userEmail}
          </p>
        )}

        <div className="mb-0 grid grid-cols-2 gap-1">
          <ContentButton
            type="button"
            variant="add"
            className="mb-2 h-40 w-full"
            size="small"
            onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
          >
            View Site
          </ContentButton>
          <LogoutButton />
        </div>

        {/* Mobile header toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "typography-bodySmall flex w-full items-center justify-between gap-2 font-bold text-[var(--color-cms-sidebar-header-text)]"
          )}
          aria-expanded={open}
          aria-controls="rhs-sections"
        >
          <h3 className="typography-h6 text-black">Sections</h3>
          <span className={cn("", "select-none")}>{open ? "▲" : "▼"}</span>
        </button>

        {/* Collapsible list on mobile, always visible on md+ */}
        <div
          id="rhs-sections"
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="mt-1 grid min-h-0 gap-[6px]">
            {manifest.map((section: any) => {
              if (section.kind !== "section") return null;
              return (
                <button
                  type="button"
                  onClick={() => handleSectionClick(section.path)}
                  key={section.path}
                  className={cn(
                    "typography-bodySmall rounded-[8px] border border-[var(--color-cms-sidebar-border)]",
                    "bg-[var(--color-cms-sidebar-item-bg)] px-1 py-[3px] text-left font-semibold text-[var(--color-cms-sidebar-item-text)] md:py-[5px]",
                    "transition-colors duration-150 hover:bg-[var(--color-cms-sidebar-item-hover-bg)]"
                  )}
                >
                  {labelFromKey(section.key)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-1 p-1">
        <ContentButton
          type="submit"
          variant="save"
          className="w-full py-[10px]"
          disabled={isSubmitting}
        >
          <span className="inline-flex items-center gap-2">
            Save Content
            {isSubmitting && <Icon name="spinner" className="size-3" />}
          </span>
        </ContentButton>
      </div>
    </div>
  );
};

export default RHSMenu;
