import {
  OG_IMAGE_VERSION,
  createOgImageRevision,
  getOgImageSecret,
  isValidOgSlug,
  signOgImage,
} from "./og-image";
import { stripLegacySeoTitleSuffix } from "../../shared/seo-title";
import { siteName } from "./site-name";

export type PageOgImageTarget =
  { kind: "home" } | { kind: "page"; slug: string };

export function getPageOgImageKey(target: PageOgImageTarget) {
  return target.kind === "home" ? "home" : `page:${target.slug}`;
}
export function getPageOgImagePath(target: PageOgImageTarget) {
  return target.kind === "home"
    ? "home"
    : `page/${target.slug.split("/").map(encodeURIComponent).join("/")}`;
}
export function parsePageOgImageTarget(
  segments: string[],
): PageOgImageTarget | null {
  if (segments.length === 1 && segments[0] === "home") return { kind: "home" };
  const [kind, ...parts] = segments;
  const slug = parts.join("/");
  return kind === "page" && isValidOgSlug(slug) ? { kind, slug } : null;
}

export function createPageOgImageRevision(title: string) {
  return createOgImageRevision([title.trim()]);
}

export function getPageOgImageTitle(title: string) {
  return stripLegacySeoTitleSuffix(title, siteName);
}

export function buildPageOgImageUrl({
  origin,
  target,
  title,
  secret = getOgImageSecret(),
}: {
  origin: string;
  target: PageOgImageTarget;
  title: string;
  secret?: string;
}) {
  if (target.kind === "page" && !isValidOgSlug(target.slug)) {
    throw new Error("Cannot build an OG image URL for an invalid page target");
  }

  const revision = createPageOgImageRevision(title);
  const key = getPageOgImageKey(target);
  const url = new URL(`/api/og/page/${getPageOgImagePath(target)}`, origin);
  url.searchParams.set("v", OG_IMAGE_VERSION);
  url.searchParams.set("rev", revision);
  url.searchParams.set("sig", signOgImage({ key, revision }, secret));
  return url.toString();
}
