import { describe, expect, it } from "vitest";
import {
  createHeaderBrandModel,
  createHeaderNavigationModel,
  flattenGroupLinks,
} from "./model";
import { siteName } from "@/lib/site-name";

const testSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 22h18"></path></svg>';

describe("createHeaderNavigationModel", () => {
  it("maps direct links, rich groups, actions, and normalized destinations", () => {
    const model = createHeaderNavigationModel({
      _id: "navigation",
      items: [
        {
          _key: "contact",
          kind: "link",
          label: "Contact",
          destination: { href: "contact", openInNewTab: false },
        },
        {
          _key: "services",
          kind: "group",
          label: "Services",
          links: [
            {
              _key: "strategy",
              label: "Strategy",
              description: "Find the clearest path through a hard problem.",
              icon: { name: "shield-check", svg: testSvg },
              destination: { href: "/strategy", openInNewTab: false },
              children: [
                { _key: "audit", label: "Audit", destination: { href: "/strategy/audit", openInNewTab: false } },
                { _key: "broken", label: "Broken", destination: null },
              ],
            },
          ],
        },
      ],
      actions: [
        {
          _key: "schedule",
          label: "Start a project",
          destination: {
            href: "https://example.com/book",
            openInNewTab: true,
          },
        },
      ],
    });

    expect(model).toEqual({
      items: [
        {
          key: "contact",
          kind: "link",
          label: "Contact",
          link: { href: "/contact", label: "Contact", openInNewTab: false },
        },
        {
          key: "services",
          kind: "group",
          label: "Services",
          links: [
            {
              key: "strategy",
              label: "Strategy",
              description: "Find the clearest path through a hard problem.",
              icon: { name: "shield-check", svg: testSvg },
              link: {
                href: "/strategy",
                label: "Strategy",
                openInNewTab: false,
              },
              children: [
                { key: "audit", label: "Audit", link: { href: "/strategy/audit", label: "Audit", openInNewTab: false } },
              ],
            },
          ],
        },
      ],
      actions: [
        {
          key: "schedule",
          link: {
            href: "https://example.com/book",
            label: "Start a project",
            openInNewTab: true,
          },
        },
      ],
    });
  });

  it("omits invalid destinations and structurally empty groups", () => {
    const model = createHeaderNavigationModel({
      _id: "navigation",
      items: [
        {
          _key: "broken",
          kind: "link",
          label: "Broken",
          destination: { href: "#", openInNewTab: false },
        },
        {
          _key: "empty",
          kind: "group",
          label: "Empty",
          links: [],
        },
      ],
      actions: [],
    });

    expect(model).toEqual({ items: [], actions: [] });
  });

  it("uses authored identity and supports settings documents from before siteName", () => {
    expect(createHeaderBrandModel(null)).toBeNull();
    expect(
      createHeaderBrandModel({ siteName: "Northline", logo: null } as never),
    ).toEqual({ dark: null, label: "Northline", light: null });
    expect(
      createHeaderBrandModel({ siteName: null, logo: null } as never),
    ).toEqual({ dark: null, label: siteName, light: null });
  });
});

describe("flattenGroupLinks", () => {
  it("lists each parent followed by its sub-links, flat", () => {
    const link = { href: "/a", label: "A", openInNewTab: false };
    const flat = flattenGroupLinks([
      { key: "a", label: "A", description: null, icon: null, link, children: [
        { key: "a1", label: "A1", link: { ...link, href: "/a/1" } },
      ] },
      { key: "b", label: "B", description: null, icon: null, link: { ...link, href: "/b" }, children: [] },
    ]);
    expect(flat.map((l) => l.key)).toEqual(["a", "a1", "b"]);
    expect(flat[1]).toMatchObject({ label: "A1", link: { href: "/a/1" }, children: [] });
  });
});
