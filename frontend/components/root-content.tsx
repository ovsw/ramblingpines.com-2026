import { PageHeading } from "@/components/shadcnblocks/page-heading";
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
  const needsTitleHeader = stegaClean(page.title)?.trim();
  const rootDataAttribute = stega
    ? (path: "description" | "title") =>
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
      {needsTitleHeader ? (
        <PageHeading
          title={page.title}
          description={
            stegaClean(page.description)?.trim() ? page.description : undefined
          }
          titleAttribute={rootDataAttribute?.("title")}
          descriptionAttribute={rootDataAttribute?.("description")}
        />
      ) : null}
      <Blocks
        blocks={blocks}
        documentId={page._id}
        perspective={perspective}
        stega={stega}
      />
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
