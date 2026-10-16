"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { HeaderNavigationItem } from "./model";

export function SideNavigationMenu({ group }: { group: Extract<HeaderNavigationItem, { kind: "group" }> }) {
  const pathname = usePathname();
  const links = <ul>{group.links.map(({ key, link }) => <li key={key}>
    <Link href={link.href} aria-current={pathname?.replace(/\/$/, "") === link.href.replace(/\/$/, "") ? "page" : undefined}
      target={link.openInNewTab ? "_blank" : undefined} rel={link.openInNewTab ? "noopener noreferrer" : undefined}>{link.label}</Link>
  </li>)}</ul>;
  return <aside className="shell-sidebar">
    <nav className="shell-sidebar-desktop" aria-label={`${group.label} pages`}><h2>{group.label}</h2>{links}</nav>
    <details className="shell-sidebar-mobile"><summary>{group.label}</summary><nav aria-label={`${group.label} pages`}>{links}</nav></details>
  </aside>;
}
