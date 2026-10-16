import { defineLocations, defineDocuments } from "sanity/presentation";
import type { PresentationPluginOptions } from "sanity/presentation";
import { ROOT_SLUG_FILTER } from "../../shared/root-slug-filter.ts";
import { resolveContentPath } from "./routes.ts";

export { resolveContentPath } from "./routes.ts";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    page: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => {
        const href = resolveContentPath(doc?.slug);
        return {
          locations: href ? [{ title: doc?.title || "Untitled", href }] : [],
        };
      },
    }),
    homePage: defineLocations({
      select: { title: "title" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Home Page", href: "/" }],
      }),
    }),
  },
  mainDocuments: defineDocuments([
    {
      route: "/",
      filter: `_id == 'homePage' && _type == 'homePage'`,
    },
    {
      route: "/:slug(.+)",
      filter: `_type == 'page' && ${ROOT_SLUG_FILTER}`,
    },
  ]),
};
