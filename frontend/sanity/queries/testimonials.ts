import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const testimonialsQuery = groq`
 _type == "testimonials" => {..., theme, title, description}
`;
