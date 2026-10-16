import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const interactiveMapQuery = groq`
 _type == "interactiveMap" => {..., theme, title, description}
`;
