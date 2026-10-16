import { fetchSanityNavigation } from "@/sanity/lib/fetch";
import type { DynamicFetchOptions } from "@/sanity/lib/live";
import { createHeaderNavigationModel } from "./model";
import { resolveSideNavigation } from "./side-navigation-model";
import { SideNavigationMenu } from "./side-navigation-menu";

export async function SideNavigation({ section, perspective, stega }: DynamicFetchOptions & { section?: string | null }) {
  if (!section || section === "none") return null;
  const raw = await fetchSanityNavigation({ perspective, stega });
  const group = resolveSideNavigation(section, createHeaderNavigationModel(raw));
  return group?.kind === "group" ? <SideNavigationMenu group={group} /> : null;
}
