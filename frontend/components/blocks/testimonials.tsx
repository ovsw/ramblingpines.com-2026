import QuoteScroller from "./quote-scroller";
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

type TestimonialsBlock = Extract<PageBlock, { _type: "testimonials" }>;

type TestimonialsProps = TestimonialsBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

export function hasTestimonialsContent(
  block: Pick<TestimonialsBlock, "quotes">,
) {
  return Boolean(block.quotes?.length);
}
export default function Testimonials({
  _key,
  title,
  description,
  quotes,
  theme,
  top = "outer",
  bottom = "outer",
  dataAttribute,
}: TestimonialsProps) {
  if (!hasTestimonialsContent({ quotes })) return null;
  const headingId = `testimonials-${stegaClean(_key)}-title`;
  return (
    <section
      className={`${sectionSceneClassName(resolveSectionTheme(theme), top, bottom)} home-testimonials`}
      aria-labelledby={title ? headingId : undefined}
      data-sanity={dataAttribute?.("theme")}
    >
      <div className="container">
        {title && (
          <h2 id={headingId} data-sanity={dataAttribute?.("title")}>
            {title}
          </h2>
        )}
        {description && (
          <p data-sanity={dataAttribute?.("description")}>{description}</p>
        )}
        <QuoteScroller>
          {quotes?.map((quote) => (
            <figure
              className="home-quote"
              key={quote._key}
              data-sanity={dataAttribute?.(`quotes[_key=="${quote._key}"]`)}
            >
              <blockquote>{quote.quote}</blockquote>
              <figcaption>~{quote.name}</figcaption>
            </figure>
          ))}
        </QuoteScroller>
      </div>
    </section>
  );
}
