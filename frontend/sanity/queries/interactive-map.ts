import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
// @sanity-typegen-ignore
export const interactiveMapQuery = groq`
 _type == "interactiveMap" => {
   ..., theme, title, description,
   campusImage{${imageQuery}},
   "markers": *[_type == "mapMarker" && !(_id in path("drafts.**"))] | order(title asc) {
     _id, title, x, y, labelDirection, description,
     images[]{${imageQuery}}
   }
 }
`;
