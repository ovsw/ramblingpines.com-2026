import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const transportationQuery = groq`
 _type == "transportation" => {..., theme, title, description}
`;
