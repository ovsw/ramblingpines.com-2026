import { groq } from "next-sanity";
import { urlInternalHref } from "./shared/internal-href";
// @sanity-typegen-ignore
export const muxVideoHeroQuery = groq`
 _type == "muxVideoHero" => {..., theme, title, description, buttons[]{..., "href": select(url.type == "internal" => ${urlInternalHref}, url.type == "external" => url.external, url.href), "openInNewTab": url.openInNewTab}}
`;
