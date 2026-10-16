import { defineQuery } from "next-sanity";

const destinationProjection = `{
  openInNewTab,
  "href": select(
    kind == "internal" => select(
      internal->_id == "homePage" || internal->_type == "homePage" => "/",
      defined(internal->slug.current) => "/" + array::join(string::split(internal->slug.current, "/")[@ != ""], "/")
    ),
    kind == "external" => external
  )
}`;

const linkProjection = `{
  _key,
  label,
  destination${destinationProjection}
}`;

export const FOOTER_QUERY = defineQuery(`
  *[_type == "footer" && _id == "footer"][0]{
    _id,
    intro,
    contact{email, phone, addressLines},
    socialLinks[]{_key, label, url},
    acaLogo{..., asset->{_id, url, metadata{dimensions, lqip}}},
    columns[]{
      _key,
      heading,
      links[]${linkProjection}
    },
    "legalLinks": coalesce(legalLinks, compliance.legalLinks)[]${linkProjection},
    "copyrightStartYear": coalesce(copyrightStartYear, compliance.copyrightStartYear),
    "copyrightOwner": coalesce(copyrightOwner, compliance.copyrightOwner)
  }
`);
