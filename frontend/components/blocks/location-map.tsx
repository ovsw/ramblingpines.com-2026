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

type LocationMapBlock = Extract<PageBlock, { _type: "locationMap" }>;

type LocationMapProps = LocationMapBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

function mapSource(block: Pick<LocationMapBlock, "location" | "address">) {
  if (!stegaClean(block.location)?.trim()) return null;
  const value = stegaClean(block.location)?.trim() || "";
  let src = `https://www.google.com/maps?q=${encodeURIComponent(value)}&output=embed`;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !["google.com", "www.google.com", "maps.google.com"].includes(
        url.hostname,
      ) ||
      !/^\/maps(?:\/|$)/.test(url.pathname)
    )
      return null;
    if (url.pathname.startsWith("/maps/embed")) src = url.href;
    else {
      const query =
        url.searchParams.get("q") || url.searchParams.get("query") || block.address;
      if (!query) return null;
      src = `https://www.google.com/maps?q=${encodeURIComponent(stegaClean(query))}&output=embed`;
    }
  } catch {
    if (/^[a-z][a-z0-9+.-]*:/i.test(value) || /[<>]/.test(value)) return null;
  }
  return src;
}

export function hasLocationMapContent(block: Pick<LocationMapBlock, "location" | "address">) {
  return Boolean(mapSource(block));
}
export default function LocationMap({
  _key,
  location,
  title,
  description,
  address,
  theme,
  top = "outer",
  bottom = "outer",
  dataAttribute,
}: LocationMapProps) {
  const src = mapSource({ location, address });
  if (!src) return null;
  const headingId = `location-${stegaClean(_key)}-title`;
  return (
    <section
      className={`embed-section ${sectionSceneClassName(resolveSectionTheme(theme), top, bottom)} home-location`}
      aria-labelledby={title ? headingId : undefined}
      data-sanity={dataAttribute?.("theme")}
    >
      <div className="container home-location-copy">
        {title && (
          <h2 id={headingId} data-sanity={dataAttribute?.("title")}>
            {title}
          </h2>
        )}
        {description && (
          <p data-sanity={dataAttribute?.("description")}>{description}</p>
        )}
        {address && (
          <address data-sanity={dataAttribute?.("address")}>{address}</address>
        )}
      </div>
      <iframe
        title={stegaClean(title) || "Camp location map"}
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        data-sanity={dataAttribute?.("location")}
      />
    </section>
  );
}
