import type { HOME_PAGE_QUERY_RESULT, PAGE_QUERY_RESULT } from "@/sanity.types";
import CampusMap from "./interactive-map/campus-map";
import { stegaClean } from "next-sanity";
import {
  resolveSectionTheme,
  sectionSceneClassName,
  type SectionSceneProps,
} from "./section-boundaries";

type PageBlock =
  | NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>["blocks"]>[number]
  | NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];

export type InteractiveMapBlock = Extract<PageBlock, { _type: "interactiveMap" }>;

type InteractiveMapProps = InteractiveMapBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

// The Page Builder excludes sections without content from visible adjacency.
// Keep this rule aligned with the renderer's empty result below.
export function hasInteractiveMapContent(
  block: Pick<InteractiveMapBlock, "campusImage">,
) {
  return Boolean(block.campusImage?.asset?.url);
}

export default function InteractiveMap({
  _key,
  campusImage,
  markers,
  bottom = "outer",
  dataAttribute,
  description,
  theme,
  title,
  top = "outer",
}: InteractiveMapProps) {
  if (!hasInteractiveMapContent({ campusImage })) return null;

  const headingId = `interactive-map-${stegaClean(_key)}-title`;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={sectionSceneClassName(resolveSectionTheme(theme), top, bottom)}
      data-sanity={dataAttribute?.("theme")}
      id={`interactive-map-${stegaClean(_key)}`}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl">
          {title ? (
          <h2
            className="text-3xl font-extrabold tracking-tight"
            data-sanity={dataAttribute?.("title")}
            id={headingId}
          >
            {title}
          </h2>
          ) : null}
          {stegaClean(description)?.trim() ? (
            <p
              className="mt-4 text-muted-foreground"
              data-sanity={dataAttribute?.("description")}
            >
              {description}
            </p>
          ) : null}
        </div>
        <div data-sanity={dataAttribute?.("campusImage")} className="mt-6">
          <CampusMap campusImage={campusImage} markers={markers} />
        </div>
      </div>
    </section>
  );
}
