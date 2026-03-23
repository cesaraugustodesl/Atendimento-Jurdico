import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { isInternalHref } from "../lib/routing";

interface RouteLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  onNavigate?: (href: string) => void;
  children: ReactNode;
}

export default function RouteLink({
  href,
  onNavigate,
  onClick,
  target,
  rel,
  children,
  ...rest
}: RouteLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      !onNavigate ||
      !isInternalHref(href) ||
      target === "_blank" ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  };

  return (
    <a href={href} onClick={handleClick} target={target} rel={rel} {...rest}>
      {children}
    </a>
  );
}
