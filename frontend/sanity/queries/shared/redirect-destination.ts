import { groq } from "next-sanity";

/** Resolve a redirect's selected document to its public route. */
export const redirectDestinationPath = groq`select(
  destinationReference->_id == "homePage" || destinationReference->_type == "homePage" => "/",
  destinationReference->_type == "page" && defined(destinationReference->slug.current) => "/" + array::join(string::split(destinationReference->slug.current, "/")[@ != ""], "/")
)`;
