import { stegaClean } from "next-sanity";
import { fetchSanityNavigation } from "@/sanity/lib/fetch";
import type { DynamicFetchOptions } from "@/sanity/lib/live";
import { createHeaderNavigationModel, type HeaderNavigationItem } from "./model";
import { resolveSideNavigation } from "./side-navigation-model";

export type SideNavigationGroup = Extract<HeaderNavigationItem, { kind: "group" }>;

/** One navigation fetch; null when the page has no section or no menu group matches it. */
export async function fetchSideNavigationGroup({ section, perspective, stega }: DynamicFetchOptions & { section?: string | null }): Promise<SideNavigationGroup | null> {
  const title = stegaClean(section)?.trim();
  if (!title || title === "none") return null;
  const raw = await fetchSanityNavigation({ perspective, stega });
  const group = resolveSideNavigation(section, createHeaderNavigationModel(raw));
  return group?.kind === "group" ? group : null;
}
