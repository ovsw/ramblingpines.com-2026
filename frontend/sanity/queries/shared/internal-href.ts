import { groq } from "next-sanity";

export const customLinkInternalHref = groq`select(
  customLink.internal->_id == "homePage" || customLink.internal->_type == "homePage" => "/",
  defined(customLink.internal->slug.current) => "/" + array::join(string::split(customLink.internal->slug.current, "/")[@ != ""], "/")
)`;

export const urlInternalHref = groq`select(
  url.internal->_id == "homePage" || url.internal->_type == "homePage" => "/",
  defined(url.internal->slug.current) => "/" + array::join(string::split(url.internal->slug.current, "/")[@ != ""], "/")
)`;

export const internalReferenceHref = groq`select(
  internal->_id == "homePage" || internal->_type == "homePage" => "/",
  defined(internal->slug.current) => "/" + array::join(string::split(internal->slug.current, "/")[@ != ""], "/")
)`;

export const linkInternalHref = groq`select(
  link.internal->_id == "homePage" || link.internal->_type == "homePage" => "/",
  defined(link.internal->slug.current) => "/" + array::join(string::split(link.internal->slug.current, "/")[@ != ""], "/")
)`;

export const legacyInternalLinkHref = groq`select(
  @.internalLink->_id == "homePage" || @.internalLink->_type == "homePage" => "/",
  defined(@.internalLink->slug.current) => "/" + array::join(string::split(@.internalLink->slug.current, "/")[@ != ""], "/")
)`;
