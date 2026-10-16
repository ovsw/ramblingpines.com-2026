import { HOME_PAGE_QUERY_RESULT, PAGE_QUERY_RESULT } from "@/sanity.types";
import { isValidOgSlug } from "@/lib/og-image";
import { siteName } from "@/lib/site-name";
import {
  buildPageOgImageUrl,
  getPageOgImageTitle,
  type PageOgImageTarget,
} from "@/lib/page-og-image";
import { resolveSeoTitle } from "../../../shared/seo-title";
import { sharingCardPhotoUrl } from "./image";
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function sharingImage(
  url: string,
  title: string,
  alt = `${title} | ${siteName}`,
) {
  return {
    url,
    width: 1200,
    height: 630,
    alt,
  };
}

function fallbackSharingImage() {
  return sharingImage(
    `${siteOrigin}/api/og/default`,
    "Helpful website content",
  );
}

export function generatePageMetadata({
  page,
  path,
}: {
  page: HOME_PAGE_QUERY_RESULT | PAGE_QUERY_RESULT;
  path: string;
}) {
  const isHomepage = page?._type === "homePage";
  const seoTitle = resolveSeoTitle({
    fallbackTitle: page?.title,
    isHomepage,
    overrideTitle: page?.meta?.title,
    siteName,
  });
  const rawPageTitle = isHomepage
    ? page.title || seoTitle.pageTitle
    : page?._type === "page"
      ? page.title || page.meta?.title
      : undefined;
  const pageTitle = rawPageTitle
    ? getPageOgImageTitle(rawPageTitle)
    : undefined;
  const pageSlug = path.replace(/^\/+|\/+$/g, "");
  const pageTarget: PageOgImageTarget | null =
    page?._type === "homePage"
      ? { kind: "home" }
      : page?._type === "page" && path !== "/" && isValidOgSlug(pageSlug)
        ? { kind: "page", slug: pageSlug }
        : null;
  const pageImage =
    pageTitle && pageTarget
      ? buildPageOgImageUrl({
          origin: siteOrigin,
          target: pageTarget,
          photoUrl: sharingCardPhotoUrl(page?.sharingPhoto),
          title: pageTitle,
        })
      : null;
  // The generated card uses the visible content title. Its alt text uses the
  // final social title, including any complete suffix supplied by the editor.
  const image =
    pageImage && pageTitle
      ? sharingImage(pageImage, pageTitle, seoTitle.finalTitle)
      : fallbackSharingImage();

  return {
    title: seoTitle.metadataTitle,
    description: page?.meta?.description,
    openGraph: {
      title: seoTitle.openGraphTitle,
      images: [image],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle.twitterTitle,
      images: [image],
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : page?.meta?.noindex
        ? "noindex"
        : "index, follow",
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL + path,
    },
  };
}
