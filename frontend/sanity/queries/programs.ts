import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const programsQuery = groq`
 _type == "programs" => {..., theme, title, description}
`;
