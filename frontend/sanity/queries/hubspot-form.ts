import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const hubspotFormQuery = groq`
 _type == "hubspotForm" => {..., theme, title, description}
`;
