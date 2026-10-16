import { richTextBlockQuery } from "./rich-text-block";
import { scaffoldQuery } from "./scaffold";
import { hubspotFormQuery } from "./hubspot-form";
import { reviewsQuery } from "./reviews";
import { videoQuery } from "./video";
import { locationMapQuery } from "./location-map";
import { muxVideoHeroQuery } from "./mux-video-hero";
import { transportationQuery } from "./transportation";
import { programsQuery } from "./programs";
import { lunchQuery } from "./lunch";
import { testimonialsQuery } from "./testimonials";
import { interactiveMapQuery } from "./interactive-map";
// page-builder-generator:query-imports

export const pageBuilderQuery = `
  blocks[]{
    _key,
    _type,
    ${richTextBlockQuery},
    ${scaffoldQuery},
    ${hubspotFormQuery},
    ${reviewsQuery},
    ${videoQuery},
    ${locationMapQuery},
    ${muxVideoHeroQuery},
    ${transportationQuery},
    ${programsQuery},
    ${lunchQuery},
    ${testimonialsQuery},
    ${interactiveMapQuery},
    ${"" /* page-builder-generator:query-spreads */}
  }
`;
