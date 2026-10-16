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

type TransportationBlock = Extract<PageBlock, { _type: "transportation" }>;

type TransportationProps = TransportationBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

export function hasTransportationContent(
  block: Pick<TransportationBlock, "title">,
) {
  return Boolean(stegaClean(block.title)?.trim());
}
export default function Transportation({
  _key,
  title,
  description,
  body,
  image,
  button,
  areasTitle,
  areas,
  theme,
  top = "outer",
  bottom = "outer",
  dataAttribute,
}: TransportationProps) {
  if (!hasTransportationContent({ title })) return null;
  const headingId = `transportation-${stegaClean(_key)}-title`;
  return (
    <section
      className={`${sectionSceneClassName(resolveSectionTheme(theme), top, bottom)} home-transportation`}
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
      {areas && areas.length > 0 && (
        <div
          className="container home-areas"
          data-sanity={dataAttribute?.("areas")}
        >
          {areasTitle && (
            <h3 data-sanity={dataAttribute?.("areasTitle")}>{areasTitle}</h3>
          )}
          <div>
            {areas.map((area) => (
              <div
                key={area._key}
                data-sanity={dataAttribute?.(`areas[_key=="${area._key}"]`)}
              >
                <h4>{area.county}</h4>
                {area.towns && area.towns.length > 0 && (
                  <ul>
                    {area.towns.map((town, index) => (
                      <li key={`${area._key}-${index}`}>{town}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
