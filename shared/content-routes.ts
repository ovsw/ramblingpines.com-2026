export type RoutedDocumentType = "page";

const ROUTE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function cleanSlug(value?: string | null) {
  return value?.trim().replace(/^\/+|\/+$/g, "") ?? "";
}

export function isRouteSlug(value?: string | null) {
  return Boolean(value && ROUTE_SLUG_PATTERN.test(value));
}

export function isPageSlug(value?: string | null) {
  const slug = cleanSlug(value);
  return Boolean(slug && slug.split("/").every(isRouteSlug));
}

export function pagePath(value?: string | null) {
  const slug = cleanSlug(value);
  return isPageSlug(slug) ? `/${slug}` : null;
}

export function routedDocumentPath(
  documentType: RoutedDocumentType,
  value?: string | null,
) {
  return pagePath(value);
}

export function normalizePublicPath(value?: string | null) {
  const trimmed = value?.trim();
  if (
    !trimmed ||
    !trimmed.startsWith("/") ||
    trimmed.includes("\\") ||
    trimmed.includes("?") ||
    trimmed.includes("#")
  ) {
    return "";
  }

  const segments = trimmed.split("/").filter(Boolean);
  return segments.length ? `/${segments.join("/")}` : "/";
}

/** Paths owned by the application rather than an editor-created document. */
export function isApplicationPath(value?: string | null) {
  const path = normalizePublicPath(value);
  if (!path) return false;

  if (
    path === "/" ||
    path === "/contact/thanks" ||
    path === "/favicon.ico" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml"
  ) {
    return true;
  }

  if (path === "/api" || path.startsWith("/api/")) return true;
  if (path === "/_next" || path.startsWith("/_next/")) return true;
  return false;
}

/** Paths that an editor-created page cannot own. */
export function isReservedPagePath(value?: string | null) {
  const path = normalizePublicPath(value);
  return Boolean(path && isApplicationPath(path));
}
