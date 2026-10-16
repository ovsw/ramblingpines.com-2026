import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { getDynamicFetchOptions, sanityFetchMetadata } from "@/sanity/lib/live";

const SITEMAP_QUERY = groq`*[
  _type in ["homePage", "page"] && meta.noindex != true &&
  (defined(slug.current) || _id == "homePage")
]{
  "url": select(_id == "homePage" => $baseUrl + "/", $baseUrl + "/" + array::join(string::split(slug.current, "/")[@ != ""], "/")),
  "lastModified": _updatedAt,
  "changeFrequency": "daily",
  "priority": select(_id == "homePage" => 1, 0.5)
} | order(priority desc, url asc)`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { perspective } = await getDynamicFetchOptions();
  const { data } = await sanityFetchMetadata({
    query: SITEMAP_QUERY,
    params: { baseUrl: process.env.NEXT_PUBLIC_SITE_URL! },
    perspective,
  });
  return (data || []) as MetadataRoute.Sitemap;
}
