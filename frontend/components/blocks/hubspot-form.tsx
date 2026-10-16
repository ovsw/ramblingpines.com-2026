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

type HubspotFormBlock = Extract<PageBlock, { _type: "hubspotForm" }>;

type HubspotFormProps = HubspotFormBlock & {
  dataAttribute?: (path: string) => string | undefined;
} & SectionSceneProps;

// The Page Builder excludes sections without content from visible adjacency.
// Keep this rule aligned with the renderer's empty result below.
export function hasHubspotFormContent(block: Pick<HubspotFormBlock, "formId">) {
  return Boolean(stegaClean(block.formId)?.trim());
}

export default function HubspotForm({
  _key,
  formId,
  bottom = "outer",
  dataAttribute,
  description,
  theme,
  title,
  top = "outer",
}: HubspotFormProps) {
  if (!hasHubspotFormContent({ formId })) return null;

  const headingId = `hubspot-form-${stegaClean(_key)}-title`;

  return (
    <section
      aria-labelledby={headingId}
      className={sectionSceneClassName(resolveSectionTheme(theme), top, bottom)}
      data-sanity={dataAttribute?.("theme")}
      id={`hubspot-form-${stegaClean(_key)}`}
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
