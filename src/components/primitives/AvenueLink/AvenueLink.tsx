import Link from "next/link";
import React, { useEffect, useState } from "react";

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  prefetch?: boolean;
  children?: React.ReactNode;
  id?: string;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

const AvenueLink = React.forwardRef(
  (
    { href, prefetch, children, className, ariaLabel, id, ...rest }: IProps,
    ref: any
  ) => {
    const [isExternalLink, setIsExternalLink] = useState(false);

    useEffect(() => {
      const tmp: any = document.createElement("a");

      if (tmp) {
        tmp.href = href;
      }

      if (tmp.host !== window.location.host) {
        setIsExternalLink(true);
      }
    }, [href]);

    const linkProps: any = {
      href,
      prefetch,
      ref,
      id,
      className,
      "aria-label": ariaLabel,
      ...rest,
    };

    // return span if no href
    if (!href?.length) {
      return <span className={className}>{children}</span>;
    }

    // return <a>  and open in new tab if an external link
    if (isExternalLink) {
      return (
        <a target="_blank" rel="noreferrer noopener" {...linkProps}>
          {children}
        </a>
      );
    }

    // return a standard Next Link
    return <Link {...linkProps}>{children}</Link>;
  }
);

export default AvenueLink;
