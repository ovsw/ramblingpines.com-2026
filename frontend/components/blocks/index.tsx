import { HOME_PAGE_QUERY_RESULT, PAGE_QUERY_RESULT } from "@/sanity.types";
import { type LivePerspective } from "next-sanity/live";
import { createDataAttribute, stegaClean } from "next-sanity";
import RichTextBlock from "@/components/blocks/rich-text-block";
import {
  resolveSectionBands,
  resolveSectionBoundaries,
  type SectionBand,
  type SectionEdgeTreatment,
} from "@/components/blocks/section-boundaries";
import Scaffold, { hasScaffoldContent } from "@/components/blocks/scaffold";
import HubspotForm, { hasHubspotFormContent } from "@/components/blocks/hubspot-form";
import Reviews, { hasReviewsContent } from "@/components/blocks/reviews";
import Video, { hasVideoContent } from "@/components/blocks/video";
import LocationMap, { hasLocationMapContent } from "@/components/blocks/location-map";
import MuxVideoHero, { hasMuxVideoHeroContent } from "@/components/blocks/mux-video-hero";
import Transportation, { hasTransportationContent } from "@/components/blocks/transportation";
import Programs, { hasProgramsContent } from "@/components/blocks/programs";
import Lunch, { hasLunchContent } from "@/components/blocks/lunch";
import Testimonials, { hasTestimonialsContent } from "@/components/blocks/testimonials";
import InteractiveMap, { hasInteractiveMapContent } from "@/components/blocks/interactive-map";
// page-builder-generator:component-imports
import { fetchSanitySettings } from "@/sanity/lib/fetch";
import { dataset, projectId } from "@/sanity/lib/env";

type Block =
  | NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>["blocks"]>[number]
  | NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];

type BlockEditingProps = {
  dataAttribute?: (path: string) => string | undefined;
};

const serverFieldEditingBlockTypes = new Set<Block["_type"]>([
  "richTextBlock",
  "scaffold",
  "hubspotForm",
  "reviews",
  "video",
  "locationMap",
  "muxVideoHero",
  "transportation",
  "programs",
  "lunch",
  "testimonials",
  "interactiveMap",
  // page-builder-generator:editing-types
]);

const componentMap: Partial<{
  [K in Block["_type"]]: React.ComponentType<
    Extract<Block, { _type: K }> & BlockEditingProps
  >;
}> = {
  richTextBlock: RichTextBlock,
  scaffold: Scaffold,
  hubspotForm: HubspotForm,
  reviews: Reviews,
  video: Video,
  locationMap: LocationMap,
  muxVideoHero: MuxVideoHero,
  transportation: Transportation,
  programs: Programs,
  lunch: Lunch,
  testimonials: Testimonials,
  interactiveMap: InteractiveMap,
  // page-builder-generator:component-map
};

// Code owns irregular top edges. A section listed here overlaps the section
// above it at a different-background join; the renderer must pass
// `topTreatment` to `sectionSceneClassName`. The Starter registers none.
const sectionEdgeTreatments: Partial<
  Record<Block["_type"], SectionEdgeTreatment>
> = {};

export default async function Blocks({
  blocks,
  documentId,
  documentType = "page",
  perspective,
  stega,
}: {
  blocks: Block[];
  documentId: string;
  documentType?: "homePage" | "page";
  perspective: LivePerspective;
  stega: boolean;
}) {
  const settings = blocks.some((block) => block._type === "hubspotForm" && hasHubspotFormContent(block))
    ? await fetchSanitySettings({ perspective, stega })
    : null;
  const visibleSections = blocks.flatMap((block) => {
    if (!componentMap[block._type] || !isRenderableBlock(block)) return [];
    return [
      {
        key: block._key,
        theme: "theme" in block ? (block.theme as string | null) : null,
        edgeTreatment: sectionEdgeTreatments[block._type] ?? "none",
      },
    ];
  });
  const resolvedBoundaries = resolveSectionBoundaries(visibleSections);

  // A band is a run of visible sections joined by seams: one continuous
  // surface. The stylesheet paints surface texture on the band, so the
  // texture does not restart at every seam. A block that renders nothing
  // stays inside the band around it; a leading one gets a plain wrapper.
  const bandStarts = new Map(
    resolveSectionBands(resolvedBoundaries).map((band) => [band.keys[0], band]),
  );
  const groups: { band?: SectionBand; blocks: Block[] }[] = [];
  for (const block of blocks) {
    const band = bandStarts.get(block._key);
    if (band || groups.length === 0) groups.push({ band, blocks: [] });
    groups[groups.length - 1].blocks.push(block);
  }

  function renderBlock(block: Block) {
    const Component = componentMap[block._type] as
      React.ComponentType<Block & BlockEditingProps> | undefined;
    if (!Component) return null;

    const blockPath = `blocks[_key=="${block._key}"]`;
    const dataSanity = stega
      ? createDataAttribute({
          baseUrl:
            process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3333",
          dataset,
          id: documentId,
          path: blockPath,
          projectId,
          type: documentType,
        }).toString()
      : undefined;
    const dataAttribute = stega
      ? (path: string) =>
          createDataAttribute({
            baseUrl:
              process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3333",
            dataset,
            id: documentId,
            path: `${blockPath}.${path}`,
            projectId,
            type: documentType,
          }).toString()
      : undefined;
    const editingProps: BlockEditingProps = serverFieldEditingBlockTypes.has(
      block._type,
    )
      ? { dataAttribute }
      : {};
    const boundary = resolvedBoundaries.find(({ key }) => key === block._key);

    return (
      <div data-sanity={dataSanity} key={block._key}>
        {block._type === "hubspotForm" ? (
          <HubspotForm {...block} {...editingProps} {...boundary} portalId={stegaClean(settings?.hubspotPortalId) ?? ""} />
        ) : (
          <Component {...block} {...editingProps} {...boundary} />
        )}
      </div>
    );
  }

  return (
    <>
      {groups.map(({ band, blocks: bandBlocks }) => (
        <div
          data-band={band?.theme ?? undefined}
          data-band-tuck={band?.tuck ? "" : undefined}
          key={bandBlocks[0]._key}
        >
          {bandBlocks.map(renderBlock)}
        </div>
      ))}
    </>
  );
}

// Sections that render nothing must not create joins. Keep each rule aligned
// with the renderer's own empty result.
function isRenderableBlock(block: Block) {
  if (block._type === "richTextBlock") {
    return Boolean(
      stegaClean(block.eyebrow)?.trim() ||
      stegaClean(block.title)?.trim() ||
      block.richText?.length,
    );
  }
  if (block._type === "scaffold") return hasScaffoldContent(block);
  if (block._type === "hubspotForm") return hasHubspotFormContent(block);
  if (block._type === "reviews") return hasReviewsContent(block);
  if (block._type === "video") return hasVideoContent(block);
  if (block._type === "locationMap") return hasLocationMapContent(block);
  if (block._type === "muxVideoHero") return hasMuxVideoHeroContent(block);
  if (block._type === "transportation") return hasTransportationContent(block);
  if (block._type === "programs") return hasProgramsContent(block);
  if (block._type === "lunch") return hasLunchContent(block);
  if (block._type === "testimonials") return hasTestimonialsContent(block);
  if (block._type === "interactiveMap") return hasInteractiveMapContent(block);
  // page-builder-generator:visible-blocks
  return true;
}
