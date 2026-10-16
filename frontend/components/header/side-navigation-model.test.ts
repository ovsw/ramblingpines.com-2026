import { describe, expect, it } from "vitest";
import { resolveSideNavigation } from "./side-navigation-model";
import type { HeaderNavigationModel } from "./model";

const group = { key: "about", kind: "group" as const, label: "About Us", links: [] };
const navigation: HeaderNavigationModel = { items: [group], actions: [] };
describe("side navigation resolution", () => {
  it("selects the menu group with the page section title", () => {
    expect(resolveSideNavigation("About Us", navigation)).toBe(group);
  });
  it("omits navigation when the page has no section", () => {
    for (const section of [undefined, null, "", "none"]) expect(resolveSideNavigation(section, navigation)).toBeNull();
  });
  it("omits navigation when no group matches", () => {
    expect(resolveSideNavigation("Staff", navigation)).toBeNull();
  });
});

describe("side navigation sub-links", () => {
  it("keeps sub-links nested under their parent in the group model", () => {
    const link = { href: "/programs", label: "Programs", openInNewTab: false };
    const nested: HeaderNavigationModel = { actions: [], items: [{ key: "ff", kind: "group", label: "Future Families", links: [
      { key: "programs", label: "Programs", description: null, icon: null, link, children: [
        { key: "day", label: "Day Camp", link: { href: "/programs/day-camp", label: "Day Camp", openInNewTab: false } },
      ] },
    ] }] };
    const group = resolveSideNavigation("Future Families", nested);
    expect(group?.kind === "group" && group.links[0].children.map((s) => s.label)).toEqual(["Day Camp"]);
  });
});
