import { type QueryParams } from "next-sanity";
import { sanityFetch, type DynamicFetchOptions } from "@/sanity/lib/live";
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from "@/sanity/queries/page";
import { NAVIGATION_QUERY } from "@/sanity/queries/navigation";
import { SETTINGS_QUERY } from "@/sanity/queries/settings";
import { FOOTER_QUERY } from "@/sanity/queries/footer";
import { HOME_PAGE_QUERY } from "@/sanity/queries/home-page";
import type {
  PAGE_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
  FOOTER_QUERY_RESULT,
  HOME_PAGE_QUERY_RESULT,
} from "@/sanity.types";
async function fetchCached<QueryResult>({
  params = {},
  perspective,
  query,
  stega,
}: {
  params?: QueryParams;
  query: string;
} & DynamicFetchOptions): Promise<QueryResult> {
  "use cache";
  const { data } = await sanityFetch({ query, params, perspective, stega });
  return data as QueryResult;
}

export function fetchSanityPageBySlug({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions): Promise<PAGE_QUERY_RESULT> {
  return fetchCached({
    query: PAGE_QUERY,
    params: { slug },
    perspective,
    stega,
  });
}

export function fetchHomePage({
  perspective,
  stega,
}: DynamicFetchOptions): Promise<HOME_PAGE_QUERY_RESULT> {
  return fetchCached({ query: HOME_PAGE_QUERY, perspective, stega });
}

export function fetchSanityNavigation({
  perspective,
  stega,
}: DynamicFetchOptions): Promise<NAVIGATION_QUERY_RESULT> {
  return fetchCached({ query: NAVIGATION_QUERY, perspective, stega });
}

export function fetchSanitySettings({
  perspective,
  stega,
}: DynamicFetchOptions): Promise<SETTINGS_QUERY_RESULT> {
  return fetchCached({ query: SETTINGS_QUERY, perspective, stega });
}

export function fetchSanityFooter({
  perspective,
  stega,
}: DynamicFetchOptions): Promise<FOOTER_QUERY_RESULT> {
  return fetchCached({ query: FOOTER_QUERY, perspective, stega });
}

export async function getCurrentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

export { PAGES_SLUGS_QUERY };
