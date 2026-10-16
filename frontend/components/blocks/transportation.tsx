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
  theme,
  top = "outer",
  bottom = "outer",
  dataAttribute,
}: TransportationProps) {
  if (!hasTransportationContent({ title })) return null;
  const areaStart =
    body?.findIndex(
      (block) =>
        block._type === "block" &&
        block.children?.some(
          (child) =>
            child._type === "span" &&
            stegaClean(child.text)?.trim() === "Transportation Areas",
        ),
    ) ?? -1;
  const introBody = areaStart >= 0 ? body?.slice(0, areaStart) : body;
  const areas = areaStart >= 0 ? body?.slice(areaStart + 1) : [];
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
            {introBody && <PortableTextRenderer value={introBody} />}
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
      {areaStart >= 0 && (
        <div
          className="container home-areas"
          data-sanity={dataAttribute?.("body")}
        >
          <h3>Transportation Areas</h3>
          <div>
            {areas?.map((area) => {
              const text =
                area._type === "block"
                  ? area.children
                      ?.map((child) =>
                        child._type === "span" ? child.text : "",
                      )
                      .join("") || ""
                  : "";
              const split = text.indexOf(":");
              return (
                <div key={area._key}>
                  {split >= 0 ? (
                    <>
                      <h4>{text.slice(0, split + 1)}</h4>
                      <ul>
                        {text
                          .slice(split + 1)
                          .split(",")
                          .map((town, i) => (
                            <li key={i}>{town.trim()}</li>
                          ))}
                      </ul>
                    </>
                  ) : (
                    <p>{text}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
