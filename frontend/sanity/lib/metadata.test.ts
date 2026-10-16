import type { HOME_PAGE_QUERY_RESULT, PAGE_QUERY_RESULT } from "@/sanity.types";
import { describe, expect, it } from "vitest";
import { verifyOgImageSignature } from "@/lib/og-image";
import { generatePageMetadata } from "./metadata";

const page = {
  _id: "page-1",
  _type: "page",
  _updatedAt: "2026-08-15T12:00:00Z",
  slug: "about",
  title: "About",
  meta: {
    title: "About | About Example Company",
    description: "About Example Company.",
    image: null,
    noindex: false,
  },
} as unknown as NonNullable<PAGE_QUERY_RESULT>;

const homePage = {
  _id: "homePage",
  _type: "homePage",
  title: "Home",
  meta: {
    title: "Example Knowledge Base | Example Company",
    description: "A practical resource library.",
    noindex: false,
  },
} as unknown as NonNullable<HOME_PAGE_QUERY_RESULT>;

describe("generatePageMetadata", () => {
  it("uses a signed generated card for ordinary page Open Graph and Twitter metadata", () => {
    const metadata = generatePageMetadata({ page, path: "/about" });
    const image = metadata.openGraph.images[0];
    const url = new URL(image.url);

    expect(metadata.openGraph).toMatchObject({
      title: "About | About Example Company",
      type: "website",
      images: [
        { width: 1200, height: 630, alt: "About | About Example Company" },
      ],
    });
    expect(url.pathname).toBe("/api/og/page/page/about");
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "About | About Example Company",
      images: [image],
    });
    expect(
      verifyOgImageSignature({
        identity: {
          key: "page:about",
          revision: url.searchParams.get("rev") || "",
          version: url.searchParams.get("v") || "",
        },
        secret: process.env.OG_IMAGE_SECRET || "",
        signature: url.searchParams.get("sig") || "",
      }),
    ).toBe(true);
    expect(metadata.title).toEqual({
      absolute: "About | About Example Company",
    });
  });

  it("falls back to the content title when the override is missing", () => {
    const pageWithoutOverride = {
      ...page,
      meta: { ...page.meta, title: null },
    } as NonNullable<PAGE_QUERY_RESULT>;
    const metadata = generatePageMetadata({
      page: pageWithoutOverride,
      path: "/about/",
    });

    expect(metadata.title).toBe("About");
    expect(metadata.openGraph.title).toBe("About | Example Company");
  });

  it("prefers an editor-selected sharing image for Open Graph and Twitter", () => {
    const pageWithImage = {
      ...page,
      meta: {
        ...page.meta,
        image: {
          asset: {
            url: "https://cdn.sanity.io/images/project/production/social.jpg",
            metadata: { dimensions: { width: 1600, height: 900 } },
          },
        },
      },
    } as unknown as NonNullable<PAGE_QUERY_RESULT>;

    const metadata = generatePageMetadata({
      page: pageWithImage,
      path: "/about",
    });
    const image = {
      url: "https://cdn.sanity.io/images/project/production/social.jpg",
      width: 1600,
      height: 900,
      alt: "About | About Example Company",
    };

    expect(metadata.openGraph.images).toEqual([image]);
    expect(metadata.twitter.images).toEqual([image]);
  });

  it("uses one absolute, branded homepage title", () => {
    const metadata = generatePageMetadata({ page: homePage, path: "/" });

    expect(metadata.title).toEqual({
      absolute: "Example Knowledge Base | Example Company",
    });
    expect(metadata.openGraph.title).toBe(
      "Example Knowledge Base | Example Company",
    );
    expect(metadata.twitter.title).toBe(
      "Example Knowledge Base | Example Company",
    );
    expect(metadata.openGraph.images[0].alt).toBe(
      "Example Knowledge Base | Example Company",
    );
  });
});
