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

type VideoBlock = Extract<PageBlock, { _type: "video" }>;

type VideoProps = VideoBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

// The Page Builder excludes sections without content from visible adjacency.
// Keep this rule aligned with the renderer's empty result below.
export function hasVideoContent(block: Pick<VideoBlock, "url">) {
  return Boolean(videoSource(block.url));
}

function videoSource(value: string | null | undefined) {
  try {
    const url = new URL(stegaClean(value)?.trim() || "");
    if (url.protocol !== "https:") return null;
    const id = url.hostname === "youtu.be"
      ? url.pathname.split("/")[1]
      : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
        ? url.pathname === "/watch"
          ? url.searchParams.get("v")
          : /^\/(embed|shorts|live)\//.test(url.pathname)
            ? url.pathname.split("/")[2]
            : null
        : null;
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}

export default function Video({
  _key,
  url,
  bottom = "outer",
  dataAttribute,
  description,
  theme,
  title,
  top = "outer",
}: VideoProps) {
  const src = videoSource(url);
  if (!src) return null;

  const headingId = `video-${stegaClean(_key)}-title`;

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={sectionSceneClassName(resolveSectionTheme(theme), top, bottom)}
      data-sanity={dataAttribute?.("theme")}
      id={`video-${stegaClean(_key)}`}
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
          <div className="mt-6 aspect-video" data-sanity={dataAttribute?.("url")}>
            <iframe
              className="h-full w-full border-0"
              src={src}
              title={stegaClean(title) || "YouTube video"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
