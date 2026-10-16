import type { HOME_PAGE_QUERY_RESULT, PAGE_QUERY_RESULT } from "@/sanity.types";
import { stegaClean } from "next-sanity";
import {
  resolveSectionTheme,
  sectionSceneClassName,
  type SectionSceneProps,
} from "./section-boundaries";

type PageBlock =
  | NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>["blocks"]>[number]
  | NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number];

type MuxVideoHeroBlock = Extract<PageBlock, { _type: "muxVideoHero" }>;

type MuxVideoHeroProps = MuxVideoHeroBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

// The Page Builder excludes sections without content from visible adjacency.
// Keep this rule aligned with the renderer's empty result below.
export function hasMuxVideoHeroContent(
  block: Pick<MuxVideoHeroBlock, "playbackId">,
) {
  return Boolean(stegaClean(block.playbackId)?.trim());
}

export default function MuxVideoHero({
  _key,
  playbackId,
  bottom = "outer",
  dataAttribute,
  description,
  theme,
  title,
  top = "outer",
}: MuxVideoHeroProps) {
  if (!hasMuxVideoHeroContent({ playbackId })) return null;

  const headingId = `mux-video-hero-${stegaClean(_key)}-title`;

  return (
    <section
      aria-labelledby={headingId}
      className={sectionSceneClassName(resolveSectionTheme(theme), top, bottom)}
      data-sanity={dataAttribute?.("theme")}
      id={`mux-video-hero-${stegaClean(_key)}`}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-3xl font-extrabold tracking-tight"
            data-sanity={dataAttribute?.("title")}
            id={headingId}
          >
            {title}
          </h2>
          {stegaClean(description)?.trim() ? (
            <p
              className="mt-4 text-muted-foreground"
              data-sanity={dataAttribute?.("description")}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
