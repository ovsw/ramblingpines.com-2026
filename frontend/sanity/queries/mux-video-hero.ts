import { groq } from "next-sanity";
// @sanity-typegen-ignore
export const muxVideoHeroQuery = groq`
 _type == "muxVideoHero" => {..., theme, title, description}
`;
