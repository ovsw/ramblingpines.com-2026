import { groq } from "next-sanity";

// The photo on a generated sharing card: the Social sharing photo first, then
// the photo the page already leads with. A photo without an asset is skipped,
// so an emptied field falls through instead of blocking the next source.
const photoProjection = groq`{ asset, crop, hotspot }`;

/** Inner pages lead with their header image; the home page has none. */
export const pageSharingPhotoQuery = groq`"sharingPhoto": select(
  defined(meta.image.asset) => meta.image,
  defined(headerImage.asset) => headerImage
)${photoProjection}`;
