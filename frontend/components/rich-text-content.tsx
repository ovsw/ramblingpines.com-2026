import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  PortableText,
  type PortableTextBlockComponent,
  type PortableTextProps,
} from "@portabletext/react";
import { buttonVariants } from "@/components/ui/button";
import { CustomLinkMarkRenderer } from "@/components/portable-text/custom-link-mark";
import { getSafeLinkHref } from "@/lib/safe-href";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { stegaClean } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

type GetHeadingId = (block: { _key?: string }) => string | undefined;
type RichTextBlockComponents = Extract<
  NonNullable<PortableTextProps["components"]>["block"],
  Record<string, unknown>
>;

type HeadingTag = "h2" | "h3" | "h4" | "h5" | "h6";

function createHeadingComponent(
  Tag: HeadingTag,
  className: string,
  getHeadingId?: GetHeadingId,
): PortableTextBlockComponent {
  return function RichTextHeading({ children, value }) {
    return (
      <Tag
        className={cn(className, getHeadingId && "scroll-mt-28")}
        id={getHeadingId?.(value)}
      >
        {children}
      </Tag>
    );
  };
}

function createRichTextHeadingComponents(getHeadingId?: GetHeadingId) {
  return {
    h2: createHeadingComponent("h2", "mb-4 mt-12 first:mt-0", getHeadingId),
    h3: createHeadingComponent("h3", "mb-4 mt-10 first:mt-0", getHeadingId),
    h4: createHeadingComponent("h4", "mb-4 mt-8 first:mt-0", getHeadingId),
    h5: createHeadingComponent("h5", "mb-4 mt-8 first:mt-0", getHeadingId),
    h6: createHeadingComponent(
      "h6",
      "mb-4 mt-8 text-base font-semibold first:mt-0",
      getHeadingId,
    ),
  };
}

const richTextBlockComponents = {
  normal: ({ children }) => <p className="mb-4">{children}</p>,
  ...createRichTextHeadingComponents(),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-border pl-4 italic">
      {children}
    </blockquote>
  ),
  inline: ({ children }) => <span>{children}</span>,
} satisfies RichTextBlockComponents;

export const richTextContentComponents: PortableTextProps["components"] = {
  block: richTextBlockComponents,
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-outside list-disc space-y-2 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-outside list-decimal space-y-2 pl-6">
        {children}
      </ol>
    ),
  },
  marks: {
    customLink: (props) => {
      // The old rich-text renderer opened absolute links in a new tab.
      const href = getSafeLinkHref(props.value?.href);
      return (
        <CustomLinkMarkRenderer
          {...props}
          value={{
            ...props.value,
            _type: "customLink",
            openInNewTab: Boolean(
              href && /^(https?:|mailto:|tel:)/i.test(href),
            ),
          }}
        />
      );
    },
    buttonLink: ({ children, value }) => {
      const href = getSafeLinkHref(value?.href);
      return href ? (
        <Link
          className={cn(
            buttonVariants({ variant: "default" }),
            "my-2 no-underline",
          )}
          href={href}
          rel={value.openInNewTab ? "noopener noreferrer" : undefined}
          target={value.openInNewTab ? "_blank" : undefined}
        >
          {children}
        </Link>
      ) : (
        <span>{children}</span>
      );
    },
  },
  types: {
    fileDownload: ({ value }) => {
      const href = getSafeLinkHref(value.asset?.url);
      if (!href) return null;
      const size = value.asset?.size;
      return (
        <p className="my-6">
          <a
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-auto max-w-full whitespace-normal no-underline",
            )}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value.description ||
              value.asset.originalFilename ||
              "Download file"}
            {typeof size === "number" && size > 0 ? (
              <span className="ml-2">
                (
                {size >= 1048576
                  ? `${(size / 1048576).toFixed(1)} MB`
                  : `${Math.ceil(size / 1024)} KB`}
                )
              </span>
            ) : null}
          </a>
        </p>
      );
    },
    youtube: ({ value }) => {
      let id: string | null = null;
      try {
        const url = new URL(stegaClean(value.url));
        if (url.protocol !== "https:") return null;
        if (url.hostname === "youtu.be") id = url.pathname.split("/")[1];
        else if (
          ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(
            url.hostname,
          )
        ) {
          id =
            url.pathname === "/watch"
              ? url.searchParams.get("v")
              : /^\/(embed|shorts|live)\//.test(url.pathname)
                ? url.pathname.split("/")[2]
                : null;
        }
      } catch {
        return null;
      }
      if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;
      return (
        <div className="my-6 aspect-video">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="YouTube video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      );
    },
    image: ({ value }) => {
      const asset = value.resolvedAsset;
      if (!asset?.url) return null;

      return (
        <figure className="my-4">
          <Image
            alt={value.alt || ""}
            blurDataURL={asset.metadata?.lqip || undefined}
            className="h-auto w-full rounded-card"
            height={asset.metadata?.dimensions?.height ?? 900}
            placeholder={asset.metadata?.lqip ? "blur" : undefined}
            quality={100}
            sizes="(min-width: 1024px) 896px, calc(100vw - 2rem)"
            src={urlFor({ asset }).width(1600).fit("max").url()}
            width={asset.metadata?.dimensions?.width ?? 1600}
          />
          {value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    table: ({ value }) => {
      const rows = Array.isArray(value.rows)
        ? value.rows.filter(
            (row: { cells?: unknown[] }) =>
              Array.isArray(row.cells) && row.cells.length > 0,
          )
        : [];
      const [headerRow, ...bodyRows] = rows;
      if (!headerRow) return null;

      return (
        <div className="relative my-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            {value.title ? (
              <caption className="sr-only">{value.title}</caption>
            ) : null}
            <thead>
              <tr>
                {headerRow.cells.map((cell: string, index: number) => (
                  <th
                    className="border border-border bg-muted px-4 py-3 font-semibold text-foreground"
                    key={`${headerRow._key ?? "header"}-${index}`}
                    scope="col"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map(
                (row: { _key?: string; cells: string[] }, rowIndex: number) => (
                  <tr key={row._key ?? `row-${rowIndex}`}>
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        className="border border-border px-4 py-3 align-top"
                        key={`${row._key ?? rowIndex}-${cellIndex}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      );
    },
    callout: ({ value }) => {
      const title = stegaClean(value.title)?.trim();
      const body = stegaClean(value.body)?.trim();
      if (!(title || body)) return null;

      return (
        <Alert role="note" className="not-prose my-8">
          {title && <AlertTitle>{title}</AlertTitle>}
          {body && <AlertDescription>{body}</AlertDescription>}
        </Alert>
      );
    },
  },
};

function createPostRichTextComponents(
  getHeadingId: GetHeadingId,
): PortableTextProps["components"] {
  return {
    ...richTextContentComponents,
    block: {
      ...richTextBlockComponents,
      ...createRichTextHeadingComponents(getHeadingId),
    },
  };
}

export default function RichTextContent({
  className,
  dataSanity,
  getHeadingId,
  value,
}: Readonly<{
  className?: string;
  dataSanity?: string;
  getHeadingId?: GetHeadingId;
  value: PortableTextProps["value"];
}>) {
  return (
    <div
      className={cn(
        "prose max-w-none break-words prose-headings:text-primary prose-headings:tracking-normal prose-a:text-primary prose-p:text-muted-foreground",
        className,
      )}
      data-sanity={dataSanity}
    >
      <PortableText
        components={
          getHeadingId
            ? createPostRichTextComponents(getHeadingId)
            : richTextContentComponents
        }
        value={value}
      />
    </div>
  );
}
