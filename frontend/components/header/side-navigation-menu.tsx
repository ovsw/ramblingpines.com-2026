"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { HeaderLinkModel, HeaderNavigationItem } from "./model";

const trimSlash = (path: string) => path.replace(/\/$/, "");

export function SideNavigationMenu({ group }: { group: Extract<HeaderNavigationItem, { kind: "group" }> }) {
  const pathname = trimSlash(usePathname() ?? "");
  const isCurrent = (link: HeaderLinkModel) => pathname === trimSlash(link.href);
  const anchor = (link: HeaderLinkModel, current: boolean) => (
    <Link href={link.href} aria-current={current ? "page" : undefined}
      target={link.openInNewTab ? "_blank" : undefined} rel={link.openInNewTab ? "noopener noreferrer" : undefined}>{link.label}</Link>
  );
  // Like the old site, a parent stays highlighted while one of its sub-pages
  // is open, so the visitor can see which branch they are in.
  const links = <ul>{group.links.map(({ key, link, children }) => <li key={key}>
    {anchor(link, isCurrent(link) || children.some((sub) => isCurrent(sub.link)))}
    {children.length > 0 && <ul className="shell-sidebar-children">{children.map((sub) => <li key={sub.key}>{anchor(sub.link, isCurrent(sub.link))}</li>)}</ul>}
  </li>)}</ul>;
  return <aside className="shell-sidebar">
    <nav className="shell-sidebar-desktop" aria-label={`${group.label} pages`}><h2>{group.label}</h2>{links}</nav>
    <details className="shell-sidebar-mobile"><summary>{group.label}</summary><nav aria-label={`${group.label} pages`}>{links}</nav></details>
  </aside>;
}
