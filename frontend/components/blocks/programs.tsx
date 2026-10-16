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

// The Page Builder excludes sections without content from visible adjacency.
// Keep this rule aligned with the renderer's empty result below.
export function hasProgramsContent(block: Pick<ProgramsBlock, "cards">) {
  return Boolean(block.cards?.length);
}

export default function Programs({
  _key,
  cards,
  bottom = "outer",
  dataAttribute,
  description,
  theme,
  title,
  top = "outer",
}: ProgramsProps) {
  if (!hasProgramsContent({ cards })) return null;

  const headingId = `programs-${stegaClean(_key)}-title`;

  return (
    <section
      aria-labelledby={headingId}
      className={sectionSceneClassName(resolveSectionTheme(theme), top, bottom)}
      data-sanity={dataAttribute?.("theme")}
      id={`programs-${stegaClean(_key)}`}
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
