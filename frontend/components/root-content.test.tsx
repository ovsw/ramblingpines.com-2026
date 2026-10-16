import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";
import { RootContentView } from "./root-content";

vi.mock("@/components/header/side-navigation", () => ({ SideNavigation: () => null }));

const page = {
  _id: "page-1",
  _type: "page",
  blocks: [],
  description: null,
  slug: "ordinary-page",
  title: "Ordinary page",
} as unknown as NonNullable<PAGE_QUERY_RESULT>;

describe("RootContentView", () => {
  it("renders the page title when no Hero provides the main heading", () => {
    render(
      <RootContentView content={page} perspective="published" stega={false} />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Ordinary page" }),
    ).toBeInTheDocument();
  });
});
