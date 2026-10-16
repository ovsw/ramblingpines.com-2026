import {
  fetchSideNavigationGroup,
  type SideNavigationGroup,
} from "@/components/header/side-navigation";
import { SideNavigationMenu } from "@/components/header/side-navigation-menu";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { createDataAttribute, stegaClean } from "next-sanity";
import Blocks from "@/components/blocks";
import { hasInteractiveMapContent } from "@/components/blocks/interactive-map";
import BreadcrumbJsonLd from "@/components/breadcrumb-json-ld";
import { siteUrl } from "@/lib/site-url";
import VideoJsonLd from "@/components/video-json-ld";
import { dataset, projectId } from "@/sanity/lib/env";
import type { DynamicFetchOptions } from "@/sanity/lib/live";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

type PageBlocks = NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>;

/**
 * A page whose only section is the interactive map renders full-bleed: no
 * side navigation, no page container, and no visible title. The map then
 * fills the first screen edge to edge, like the old site's map page. An
 * editor opts in by giving the page that single section; no layout field
 * is needed.
 */
export function isFullBleedPage(blocks: PageBlocks) {
  const [only] = blocks;
  return (
    blocks.length === 1 &&
    only._type === "interactiveMap" &&
    hasInteractiveMapContent(only)
  );
}

function PageContent({
  page,
  perspective,
  sideNavigation,
  stega,
}: {
  page: NonNullable<PAGE_QUERY_RESULT>;
  perspective: DynamicFetchOptions["perspective"];
  sideNavigation: SideNavigationGroup | null;
  stega: boolean;
}) {
  const blocks = page.blocks ?? [];
  // The sidebar layout depends on a resolved menu group, not on the raw
  // section value, so an unmatched group never leaves content in the
  // 240px column.
  const fullBleed = isFullBleedPage(blocks);
  const hasSideNavigation = Boolean(sideNavigation) && !fullBleed;
  const banner = fullBleed ? null : page.headerImage;
  const needsTitleHeader = stegaClean(page.title)?.trim();
  const rootDataAttribute = stega
    ? (path: "description" | "title" | "headerImage") =>
        createDataAttribute({
          baseUrl:
            process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3333",
          dataset,
          id: page._id,
          path,
          projectId,
          type: "page",
        }).toString()
    : undefined;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: page.title || "Page", path: `/${page.slug}` },
        ]}
        siteUrl={siteUrl}
      />
      <VideoJsonLd content={blocks} />
      {banner?.asset?.url ? (
        <div
          className="generic-page-banner"
          data-sanity={rootDataAttribute?.("headerImage")}
        >
          <Image
            src={urlFor(banner).width(1920).url()}
            alt={banner.alt || ""}
            fill
            sizes="100vw"
            className="object-cover"
            preload
            placeholder={banner.asset.metadata?.lqip ? "blur" : undefined}
            blurDataURL={banner.asset.metadata?.lqip || undefined}
          />
        </div>
      ) : null}
      {fullBleed ? (
        <div className="generic-page-body generic-page-full-bleed">
          {needsTitleHeader ? (
            <h1 className="sr-only" data-sanity={rootDataAttribute?.("title")}>
              {page.title}
            </h1>
          ) : null}
          <Blocks
            blocks={blocks}
            documentId={page._id}
            perspective={perspective}
            stega={stega}
          />
        </div>
      ) : (
      <div
        className={`generic-page-body${banner?.asset?.url ? " paper-edge-top" : ""}`}
      >
        <div
          className={
            hasSideNavigation
              ? "shell-page-with-sidebar container"
              : "generic-page-content container"
          }
        >
          {hasSideNavigation && sideNavigation && (
            <SideNavigationMenu group={sideNavigation} />
          )}
          <div className="generic-page-main min-w-0">
            {needsTitleHeader ? (
              <header className="mb-8">
                <h1
                  className="text-4xl font-semibold uppercase md:text-5xl"
                  data-sanity={rootDataAttribute?.("title")}
                >
                  {page.title}
                </h1>
                {stegaClean(page.description)?.trim() ? (
                  <p
                    className="mt-4 text-lg"
                    data-sanity={rootDataAttribute?.("description")}
                  >
                    {page.description}
                  </p>
                ) : null}
              </header>
            ) : null}
            <Blocks
              blocks={blocks}
              documentId={page._id}
              perspective={perspective}
              stega={stega}
            />
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export async function RootContentView({
  content,
  perspective,
  stega,
}: {
  content: NonNullable<PAGE_QUERY_RESULT>;
  perspective: DynamicFetchOptions["perspective"];
  stega: boolean;
}) {
  const sideNavigation = await fetchSideNavigationGroup({
    section: content.section,
    perspective,
    stega,
  });
  return (
    <PageContent
      page={content}
      perspective={perspective}
      sideNavigation={sideNavigation}
      stega={stega}
    />
  );
}
