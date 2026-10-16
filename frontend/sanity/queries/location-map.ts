import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const locationMapQuery = groq`
 _type == "locationMap" => {..., theme, title, description}
`;
