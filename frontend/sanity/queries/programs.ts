import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { linkInternalHref } from "./shared/internal-href";
// @sanity-typegen-ignore
export const programsQuery = groq`
 _type == "programs" => {..., theme, title, description, cards[]{..., icon{${imageQuery}}, "href": select(link.type == "internal" => ${linkInternalHref}, link.type == "external" => link.external, link.href), "openInNewTab": link.openInNewTab}}
`;
