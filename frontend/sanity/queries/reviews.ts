import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const reviewsQuery = groq`
 _type == "reviews" => {..., theme, title, description}
`;
