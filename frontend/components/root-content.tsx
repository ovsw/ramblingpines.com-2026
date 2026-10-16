import { SideNavigation } from "@/components/header/side-navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { createDataAttribute, stegaClean } from "next-sanity";
import Blocks from "@/components/blocks";
import BreadcrumbJsonLd from "@/components/breadcrumb-json-ld";
import { siteUrl } from "@/lib/site-url";
import VideoJsonLd from "@/components/video-json-ld";
import { dataset, projectId } from "@/sanity/lib/env";
import type { DynamicFetchOptions } from "@/sanity/lib/live";
import type { PAGE_QUERY_RESULT } from "@/sanity.types";

function PageContent({
  page,
  perspective,
  stega,
}: {
  page: NonNullable<PAGE_QUERY_RESULT>;
  perspective: DynamicFetchOptions["perspective"];
  stega: boolean;
}) {
  const blocks = page.blocks ?? [];
  const hasSideNavigation = Boolean(
    page.section && stegaClean(page.section) !== "none",
  );
  const banner = page.headerImage;
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
          {hasSideNavigation && (
            <SideNavigation
              section={page.section}
              perspective={perspective}
              stega={stega}
            />
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
    </>
  );
}

export function RootContentView({
  content,
  perspective,
  stega,
}: {
  content: NonNullable<PAGE_QUERY_RESULT>;
  perspective: DynamicFetchOptions["perspective"];
  stega: boolean;
}) {
  return <PageContent page={content} perspective={perspective} stega={stega} />;
}
