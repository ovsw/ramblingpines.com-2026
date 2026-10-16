import { readFileSync } from "node:fs";
import { text, url } from "./transform.mjs";
const seed = JSON.parse(
  readFileSync(new URL("./seed.json", import.meta.url), "utf8"),
);
export const localAssets = [
  "transportation-illustration.png",
  "lunch-time-illustration.png",
  "aca-logo.png",
  "rambling-pines-art-logo.png",
  "rambling-pines-day-camp-map.jpg",
  "pineCone.svg",
  "dayCamp.svg",
  "teenagers.svg",
  "leader.svg",
];
export function seedDocuments(source, assets, playbackId) {
  const img = (name, alt) => ({
    _type: "image",
    alt,
    asset: { _type: "reference", _ref: assets[name] },
  });
  const button = (
    label,
    href,
    key = label.toLowerCase().replaceAll(" ", "-"),
  ) => ({
    _key: key,
    _type: "button",
    text: label,
    url: url(href),
  });
  const paragraphs = (values) =>
    values.map((s, i) => text(s, `paragraph-${i}`));
  const contact = {
    _type: "contactDetails",
    phone: "(609) 466-1212",
    email: "info@ramblingpines.com",
    addressLines: [
      "174 Lambertville Hopewell Rd.",
      "Hopewell, NJ 08525",
      "United States",
    ],
  };
  const campLinks = {
    enroll:
      "https://ramblingpines.campintouch.com/ui/forms/application/camper/App",
    parentLogin: "https://ramblingpines.campintouch.com/v2/login/login.aspx",
    staffApplication:
      "https://ramblingpines.campintouch.com/ui/forms/application/staff/App",
    store: "https://www.bunkline.com/category-s/602.htm",
    tour: "https://calendly.com/ramblingpines/camp-tour",
  };
  const socialLinks = [
    ["Instagram", "https://www.instagram.com/ramblingpines/"],
    ["Facebook", "https://www.facebook.com/ramblingpinesdaycampnj/"],
    ["YouTube", "https://www.youtube.com/user/funsummers"],
    ["Twitter", "https://twitter.com/ramblingpines"],
  ].map(([label, url], i) => ({
    _key: `social-${i}`,
    _type: "socialLink",
    label,
    url,
  }));
  const paths = new Map(
    source
      .filter((d) => d._type === "page" && !d._id.startsWith("drafts."))
      .map((d) => [`/${d.slug.current}/`, d._id]),
  );
  paths.set("/", "homePage");
  paths.set("/interactive-map/", "interactiveMap");
  const dest = (href, type) =>
    paths.has(href)
      ? {
          _type: type,
          kind: "internal",
          internal: { _type: "reference", _ref: paths.get(href) },
          openInNewTab: false,
        }
      : { _type: type, kind: "external", external: href, openInNewTab: false };
  const link = (label, href, i, type = "navigationChildLink") => ({
    _key: `link-${i}`,
    _type: type,
    label,
    destination: dest(
      href,
      type === "footerLink" ? "footerDestination" : "navigationDestination",
    ),
  });
  const flatten = (children) =>
    children.flatMap((c) => [
      ...(c.slug ? [c] : []),
      ...flatten(c.children || []),
    ]);
  const items = seed.navigation.map((g, i) => ({
    _key: `group-${i}`,
    _type: "navigationGroup",
    label: g.title === "About us" ? "About Us" : g.title,
    links: flatten(g.children).map((l, i) => link(l.title, l.slug, i)),
  }));
  const sections = [
    {
      _type: "muxVideoHero",
      heading: "A Summer Day Camp Like no Other.",
      intro:
        "Your kids deserve the best. The best supervision, the best activities, the best friends, the best memories.",
      playbackId,
      buttons: [
        button("Work at Camp", "/staff/current-openings/"),
        button("Schedule a Tour", campLinks.tour),
        button("Enroll Now", campLinks.enroll),
      ],
    },
    {
      _type: "transportation",
      title: "Door to Door Transportation",
      body: paragraphs([
        "Parents wish for a quality summer day camp near them. With door to door busing, it is.",
        "Transportation is provided using air-conditioned, 24 passenger mini-buses.",
        "All buses are professionally driven and have seatbelts. There is a bus aid on each bus. Transportation is included in the camp tuition.",
      ]),
      areasTitle: "Transportation Areas",
      areas: seed.transportationAreas.map((a, index) => ({
        _key: `area-${index}`,
        _type: "area",
        county: a.county,
        towns: a.towns,
      })),
      image: img(
        "transportation-illustration.png",
        "Transportation illustration",
      ),
      button: button("Read More", "/transportation/"),
    },
    {
      _type: "programs",
      title: "Programs",
      description:
        "Each program provides structured activities chosen for your child's age group, along with well-trained and caring counselors and all the fun and excitement your child needs for the perfect summer.\n\nTo make the summer a little easier for parents, we offer these special benefits for busy families:\nComplimentary door-to-door bus service\nFlexible camp schedules for busy families\nModified program available to preschoolers",
      cards: seed.programs.map((p, i) => ({
        _key: `program-${i}`,
        _type: "programCard",
        title: p.name,
        ageRange: p.description,
        icon: img(`${p.icon}.svg`, p.name),
        link: url(p.link),
      })),
    },
    {
      _type: "lunch",
      title: "Lunch Provided",
      body: [
        ...paragraphs([
          "To make your life a little bit easier, a nutritious and delicious lunch is provided daily.",
          "A vegetarian option is always available. Little ones get a morning snack and everyone enjoys an afternoon snack of ice cream or ice pops.",
        ]),
        {
          ...text("Request Info", "request-info"),
          markDefs: [
            {
              _key: "request-link",
              _type: "customLink",
              customLink: url("/request-info/"),
            },
          ],
          children: [
            {
              _key: "request-span",
              _type: "span",
              text: "Request Info",
              marks: ["request-link"],
            },
          ],
        },
      ],
      image: img("lunch-time-illustration.png", "Lunch time illustration"),
      button: button("Lunch Menu", "/lunch/"),
    },
    {
      _type: "locationMap",
      title: "Rambling Pines location map",
      location: seed.location,
      address: contact.addressLines.join("\n"),
    },
    {
      _type: "testimonials",
      title: "What Parents Say",
      quotes: seed.quotes.map((q, i) => ({
        _key: `quote-${i}`,
        _type: "quote",
        quote: q.text,
        name: q.name,
      })),
    },
  ].map((s, i) => ({ _key: `home-${i}`, theme: "light", ...s }));
  return [
    {
      _id: "homePage",
      _type: "homePage",
      title: "Home",
      blocks: sections,
      meta: {
        title: source.find((d) => d._type === "siteSettings")?.title,
        image: source.find((d) => d._id === "workingAtRBP")?.headerImage
          ? {
              ...source.find((d) => d._id === "workingAtRBP").headerImage,
              _type: "image",
              asset: {
                _type: "reference",
                _ref: assets[
                  source.find((d) => d._id === "workingAtRBP").headerImage.asset
                    ._ref
                ],
              },
            }
          : undefined,
      },
    },
    {
      _id: "siteSettings",
      _type: "settings",
      contact,
      campLinks,
      socialLinks,
      hubspotPortalId: "5711800",
      gtmContainerId: "GTM-PGMWV3V",
      logo: {
        light: img("rambling-pines-art-logo.png", "Rambling Pines Day Camp"),
        dark: img("rambling-pines-art-logo.png", "Rambling Pines Day Camp"),
      },
    },
    {
      _id: "navigation",
      _type: "navigation",
      items,
      topLinkColumns: [
        {
          _key: "top-left",
          _type: "navigationGroup",
          label: "Camp information",
          links: [
            link("Dates & Rates", "/dates-and-rates/", 0),
            link("Interactive Map", "/interactive-map/", 1),
          ],
        },
        {
          _key: "top-right",
          _type: "navigationGroup",
          label: "Join us",
          links: [
            link("Request Info", "/request-info/", 0),
            link("Enroll Now", campLinks.enroll, 1),
          ],
        },
      ],
    },
    {
      _id: "footer",
      _type: "footer",
      contact,
      socialLinks,
      acaLogo: img("aca-logo.png", "American Camp Association logo"),
      copyrightStartYear: 1976,
      copyrightOwner: "Rambling Pines Day Camp",
      legalLinks: [
        ["Terms & Conditions", "/terms-and-conditions/"],
        ["Privacy Policy", "/privacy-policy/"],
        ["ADA Compliance", "/ada-compliance/"],
        ["Contact", "/request-info/"],
      ].map(([label, href], i) => link(label, href, i, "footerLink")),
    },
    {
      _id: "interactiveMap",
      _type: "page",
      title: "Interactive Map",
      slug: { _type: "slug", current: "interactive-map" },
      section: "About Us",
      blocks: [
        {
          _key: "map",
          _type: "interactiveMap",
          theme: "light",
          campusImage: img(
            "rambling-pines-day-camp-map.jpg",
            "Rambling Pines Day Camp campus map",
          ),
        },
      ],
    },
    ...seed.redirects.map(([from, to], i) => {
      if (!paths.has(to))
        throw new Error(`Redirect destination missing: ${to}`);
      return {
        _id: `legacy-redirect-${i + 1}`,
        _type: "redirect",
        status: "active",
        source: { _type: "slug", current: from },
        destinationReference: { _type: "reference", _ref: paths.get(to) },
        permanent: "true",
      };
    }),
  ];
}
