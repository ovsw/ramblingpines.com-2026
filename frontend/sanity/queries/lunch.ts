import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { customLinkMarkDefsQuery } from "./shared/custom-link";
import { urlInternalHref } from "./shared/internal-href";
// @sanity-typegen-ignore
export const lunchQuery = groq`
 _type == "lunch" => {..., theme, title, description, image{${imageQuery}}, body[]{..., ${customLinkMarkDefsQuery}}, button{..., "href": select(url.type == "internal" => ${urlInternalHref}, url.type == "external" => url.external, url.href), "openInNewTab": url.openInNewTab}}
`;
