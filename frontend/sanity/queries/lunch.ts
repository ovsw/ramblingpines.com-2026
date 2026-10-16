import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const lunchQuery = groq`
 _type == "lunch" => {..., theme, title, description}
`;
