import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const videoQuery = groq`
 _type == "video" => {..., theme, title, description}
`;
