import { HomeImage } from "./home-content";
import { getSafeLinkHref } from "@/lib/safe-href";
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

type ProgramsBlock = Extract<PageBlock, { _type: "programs" }>;

type ProgramsProps = ProgramsBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

export function hasProgramsContent(block: Pick<ProgramsBlock, "cards">) {
  return Boolean(block.cards?.length);
}
export default function Programs({
  _key,
  title,
  description,
  cards,
  theme,
  top = "outer",
  bottom = "outer",
  dataAttribute,
}: ProgramsProps) {
  if (!hasProgramsContent({ cards })) return null;
  const headingId = `programs-${stegaClean(_key)}-title`;
  return (
    <section
      className={`${sectionSceneClassName(resolveSectionTheme(theme), top, bottom)} home-programs`}
      aria-labelledby={title ? headingId : undefined}
      data-sanity={dataAttribute?.("theme")}
    >
      <div className="container home-split">
        <div className="home-copy">
          {title && (
            <h2 id={headingId} data-sanity={dataAttribute?.("title")}>
              {title}
            </h2>
          )}
          {description && (
            <p
              className="whitespace-pre-line"
              data-sanity={dataAttribute?.("description")}
            >
              {description}
            </p>
          )}
        </div>
        <div className="home-program-grid">
          {cards?.map((card) => {
            const href = getSafeLinkHref(card.href);
            const content = (
              <>
                <span className="home-program-icon-circle">
                  <HomeImage image={card.icon} icon />
                </span>
                <h3>{card.title}</h3>
                <p>{card.ageRange}</p>
              </>
            );
            return href ? (
              <a
                className="home-program-card"
                key={card._key}
                href={href}
                target={card.openInNewTab ? "_blank" : undefined}
                rel={card.openInNewTab ? "noopener noreferrer" : undefined}
                data-sanity={dataAttribute?.(`cards[_key=="${card._key}"]`)}
              >
                {content}
              </a>
            ) : (
              <div className="home-program-card" key={card._key}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
