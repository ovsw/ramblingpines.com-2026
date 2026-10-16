import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";
import { RootContentView } from "./root-content";

// Async server sections are outside this title-header test.
vi.mock("@/components/blocks", () => ({ default: () => null }));
vi.mock("@/components/header/side-navigation", () => ({
  fetchSideNavigationGroup: async () => ({
    kind: "group",
    key: "about",
    label: "About Us",
    links: [{ key: "map", link: { href: "/interactive-map/", label: "Map" } }],
  }),
}));

const page = {
  _id: "page-1",
  _type: "page",
  blocks: [],
  description: null,
  section: "About Us",
  slug: "ordinary-page",
  title: "Ordinary page",
} as unknown as NonNullable<PAGE_QUERY_RESULT>;

const mapPage = {
  ...page,
  _id: "page-map",
  blocks: [{ _key: "map", _type: "interactiveMap" }],
  slug: "interactive-map",
  title: "Interactive Map",
} as unknown as NonNullable<PAGE_QUERY_RESULT>;

describe("RootContentView", () => {
  it("renders the page title when no Hero provides the main heading", async () => {
    render(
      await RootContentView({
        content: page,
        perspective: "published",
        stega: false,
      }),
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Ordinary page" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("navigation", { name: "About Us pages" }),
    ).not.toHaveLength(0);
  });

  it("renders a page with only the interactive map full-bleed", async () => {
    const { container } = render(
      await RootContentView({
        content: mapPage,
        perspective: "published",
        stega: false,
      }),
    );

    expect(
      screen.queryAllByRole("navigation", { name: "About Us pages" }),
    ).toHaveLength(0);
    expect(container.querySelector(".container")).toBeNull();
    expect(container.querySelector(".generic-page-full-bleed")).not.toBeNull();
    // The title stays for assistive technology; it is hidden visually.
    expect(
      screen.getByRole("heading", { level: 1, name: "Interactive Map" }),
    ).toHaveClass("sr-only");
  });
});
