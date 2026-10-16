import PortableTextRenderer from "@/components/portable-text-renderer";
import { HomeButton, HomeImage } from "./home-content";
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

type LunchBlock = Extract<PageBlock, { _type: "lunch" }>;

type LunchProps = LunchBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

export function hasLunchContent(block: Pick<LunchBlock, "title">) {
  return Boolean(stegaClean(block.title)?.trim());
}
export default function Lunch({
  _key,
  title,
  description,
  body,
  image,
  button,
  theme,
  top = "outer",
  bottom = "outer",
  dataAttribute,
}: LunchProps) {
  if (!hasLunchContent({ title })) return null;
  const headingId = `lunch-${stegaClean(_key)}-title`;
  return (
    <section
      className={`${sectionSceneClassName(resolveSectionTheme(theme), top, bottom)} home-lunch`}
      aria-labelledby={headingId}
      data-sanity={dataAttribute?.("theme")}
    >
      <div className="container home-split">
        <div className="home-copy">
          <h2 id={headingId} data-sanity={dataAttribute?.("title")}>
            {title}
          </h2>
          {description && (
            <p data-sanity={dataAttribute?.("description")}>{description}</p>
          )}
          <div data-sanity={dataAttribute?.("body")}>
            {body && <PortableTextRenderer value={body} />}
          </div>
          {button && (
            <div data-sanity={dataAttribute?.("button")}>
              <HomeButton {...button} />
            </div>
          )}
        </div>
        <div className="home-art" data-sanity={dataAttribute?.("image")}>
          <HomeImage image={image} />
        </div>
      </div>
    </section>
  );
}
