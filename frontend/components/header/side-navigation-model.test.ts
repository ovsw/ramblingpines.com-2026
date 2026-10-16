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
