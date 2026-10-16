import Image from "next/image";
import { HomeButton } from "./home-content";
import HeroVideo from "./hero-video";
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

export function hasMuxVideoHeroContent(
  block: Pick<MuxVideoHeroBlock, "heading" | "playbackId">,
) {
  return Boolean(
    stegaClean(block.heading)?.trim() || stegaClean(block.playbackId)?.trim(),
  );
}
export default function MuxVideoHero({
  _key,
  heading,
  intro,
  playbackId,
  buttons,
  theme,
  top = "outer",
  bottom = "outer",
  dataAttribute,
}: MuxVideoHeroProps) {
  if (!hasMuxVideoHeroContent({ heading, playbackId })) return null;
  const headingId = `hero-${stegaClean(_key)}-title`;
  return (
    <section
      className={`${sectionSceneClassName(resolveSectionTheme(theme), top, bottom)} home-hero`}
      aria-labelledby={heading ? headingId : undefined}
      data-sanity={dataAttribute?.("theme")}
    >
      <HeroVideo playbackId={stegaClean(playbackId) || ""} />
      <div className="container home-hero-content">
        <Image
          src="/images/home/rambling-pines-art-logo.png"
          alt="Rambling Pines Day Camp"
          width={480}
          height={440}
          priority
          className="home-hero-logo"
        />
        {heading && (
          <h1 id={headingId} data-sanity={dataAttribute?.("heading")}>
            {heading}
          </h1>
        )}
        {intro && <p data-sanity={dataAttribute?.("intro")}>{intro}</p>}
        <div className="home-hero-buttons">
          {buttons?.map((button, index) => (
            <span
              key={button._key}
              data-sanity={dataAttribute?.(`buttons[_key=="${button._key}"]`)}
            >
              <HomeButton {...button} accent={index === 1} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
