# Content model

The Website reads structured content from one Sanity project and dataset.

## Routed content

- `homePage` owns `/`.
- `page` owns normal page slugs such as `/about/`.
- `redirect` maps an old path to routed content or an external URL.

## Shared content

- `settings`, `navigation`, and `footer` are global documents.
- `faq`, `teamMember`, and `testimonial` are reusable records.
- Pages compose top-level sections through their `blocks` array.
- `homePage` and `page` also carry a `blocksArchive` array that
  accepts the same section types. Replaced Scaffolds move there. The Website
  reads only `blocks`.

## Section library

The Starter ships two sections and presumes no design:

- `richTextBlock` is a finished long-form section and a valid final match for a
  Scaffold.
- `scaffold` is a placeholder with `name`, `richText`, and
  `proposedSectionShape`. It renders its rich text with a visible internal
  marker so nobody mistakes it for a finished section.

Every other section belongs to its own project copy. Generate one with
`pnpm page-builder:new`.

## Page Builder path

Each section has one shared `_type` across its Studio schema, Page Builder registration, GROQ projection, generated TypeScript type, and React renderer. See `docs/agents/page-builder.md` for the extension steps.

Sanity owns authored content. The repository owns schemas, queries, rendering, routing rules, and generated types.

## Rambling Pines fields

Pages add `headerImage` with required alt text and `section`. The section is
`Future Families`, `About Us`, `Current Families`, `Staff`, or `none`.
Navigation group `label` values match these section names. `none` means no
side navigation. A grouped navigation link can hold `children` (sub-links:
label and destination). The side navigation indents them under their parent
with bullets, like the old site; the header menu lists them flat after the
parent. The Starter `homePage` singleton continues to own `/`.

A page whose only section is the interactive map renders full-bleed: no side
navigation, no page container, no visible title, and the map fills the first
screen below the header. The imported `/interactive-map/` page uses this.

`settings.siteName` is the site title. Settings also hold `description`,
`alertBar.enabled`, `alertBar.text`, `contact`, `socialLinks`, `campLinks`,
`hubspotPortalId`, and `gtmContainerId`. Camp links are `enroll`, `parentLogin`,
`staffApplication`, `store`, and `tour`. Navigation uses `items` for the main
menu groups and `topLinkColumns` for the top links. Groups use `label` and
`links`; links retain the Starter destination object. Footer adds `contact`,
`socialLinks`, and `acaLogo`.

`mapMarker` stores `title`, `x`, `y`, `labelDirection`, `description`, and
`images`. Coordinates use the campus image coordinate system. Directions are
right, left, top, or bottom. Description allows paragraphs, bold, and italic.
Images require alt text.

Rich Text retains text styles, lists, links, images with alt text and caption,
and tables. The first table row is the header. It adds `fileDownload`, a file
asset with required `description`, and `youtube`, with a YouTube `url`.
Links allow HTTP, HTTPS, mailto, tel, and relative paths. No content type
accepts raw HTML, iframe markup, or scripts.

## Camp sections

Each section has a generator registration, Studio grid preview, query, and
empty-content rule. The rendering issues add the final site behavior.

- `hubspotForm`: `formId`. Portal ID comes from settings.
- `reviews`: EmbedSocial `widgetId`.
- `video`: YouTube `url`.
- `locationMap`: Google Maps URL or place query in `location`, plus `address`.
- `muxVideoHero`: `playbackId`, `heading`, `intro`, and up to three `buttons`.
  The player derives the poster from the playback ID.
- `transportation` and `lunch`: `title`, `description`, `body`, `image`, `button`.
- `programs`: four `cards`, each with `icon`, `title`, `ageRange`, and `link`.
- `testimonials`: `quotes`, each with `quote` and `name`.
- `interactiveMap`: `campusImage`. The renderer reads published map markers.

All camp sections allow an optional `title` and `description`. Empty embed
sections need their ID or URL before they participate in page spacing. Programs
and testimonials need items. The interactive map needs an image asset.
Transportation and lunch need a title.
