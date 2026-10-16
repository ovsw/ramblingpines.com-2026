import ReviewsEmbed from "./reviews-embed";
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

type ReviewsBlock = Extract<PageBlock, { _type: "reviews" }>;

type ReviewsProps = ReviewsBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

// The Page Builder excludes sections without content from visible adjacency.
// Keep this rule aligned with the renderer's empty result below.
export function hasReviewsContent(block: Pick<ReviewsBlock, "widgetId">) {
  return /^[a-zA-Z0-9_-]+$/.test(stegaClean(block.widgetId)?.trim() || "");
}

export default function Reviews({
  _key,
  widgetId,
  bottom = "outer",
  dataAttribute,
  description,
  theme,
  title,
  top = "outer",
}: ReviewsProps) {
  if (!hasReviewsContent({ widgetId })) return null;

  const headingId = `reviews-${stegaClean(_key)}-title`;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={sectionSceneClassName(resolveSectionTheme(theme), top, bottom)}
      data-sanity={dataAttribute?.("theme")}
      id={`reviews-${stegaClean(_key)}`}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl">
          {title ? <h2
            className="text-3xl font-extrabold tracking-tight"
            data-sanity={dataAttribute?.("title")}
            id={headingId}
          >
            {title}
          </h2> : null}
          {stegaClean(description)?.trim() ? (
            <p
              className="mt-4 text-muted-foreground"
              data-sanity={dataAttribute?.("description")}
            >
              {description}
            </p>
          ) : null}
          <div className="mt-6" data-sanity={dataAttribute?.("widgetId")}>
            <ReviewsEmbed key={stegaClean(widgetId)} widgetId={stegaClean(widgetId)?.trim() || ""} />
          </div>
        </div>
      </div>
    </section>
  );
}
