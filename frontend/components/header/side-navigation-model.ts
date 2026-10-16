import { stegaClean } from "next-sanity";
import type { HeaderNavigationModel } from "./model";

export function resolveSideNavigation(section: string | null | undefined, navigation: HeaderNavigationModel) {
  const title = stegaClean(section)?.trim();
  if (!title || title === "none") return null;
  return navigation.items.find((item) => item.kind === "group" && stegaClean(item.label) === title) ?? null;
}
