import Image from "next/image";
import { stegaClean } from "next-sanity";
import { getSafeLinkHref } from "@/lib/safe-href";
import { urlFor } from "@/sanity/lib/image";

export function HomeButton({
  text,
  href,
  openInNewTab,
  accent = false,
}: {
  text?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
  accent?: boolean;
}) {
  const safeHref = getSafeLinkHref(href);
  if (!safeHref || !stegaClean(text)?.trim()) return null;
  return (
    <a
      className={`home-button${accent ? " home-button-accent" : ""}`}
      href={safeHref}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
    >
      {text}
    </a>
  );
}

export function HomeImage({
  image,
  icon = false,
}: {
  image?: {
    alt?: string | null;
    asset?: { _id: string; url: string | null; mimeType: string | null } | null;
    crop?: { top?: number; bottom?: number; left?: number; right?: number };
    hotspot?: { x?: number; y?: number; width?: number; height?: number };
  } | null;
  icon?: boolean;
}) {
  if (!image?.asset?.url) return null;
  const svg = image.asset.mimeType === "image/svg+xml";
  return (
    <Image
      src={
        svg
          ? image.asset.url
          : urlFor(image)
              .width(icon ? 120 : 900)
              .url()
      }
      alt={stegaClean(image.alt) || ""}
      width={icon ? 64 : 900}
      height={icon ? 64 : 750}
      unoptimized={svg}
      sizes={icon ? "64px" : "(max-width: 768px) 100vw, 60vw"}
      className={icon ? "home-program-icon" : "home-illustration"}
    />
  );
}
