# Old site build input

Captured on 2026-10-16 for issue #9, part of #5.

- [URL inventory](url-inventory.md): 38 public paths, page titles, old sections, document IDs, page kinds and links to both screenshots.
- [Block inventory](block-inventory.md): all 41 page records, 44 map markers, embed IDs and 23 active path redirects.
- [Hard-coded content](hard-coded-content.md): home page, navigation, header and footer seed content from the old public source.
- [Capture manifest](capture-manifest.json): dimensions, byte sizes and SHA-256 values for all 76 PNG files.
- [Sitemap snapshot](sitemap-2026-10-16.xml): source URL list.

The screenshots are build input only. No new-site appearance was checked. The browser captured the normal page state without opening menus or submitting forms. Third-party widgets and video can change after capture.

## Source corrections for the importer

The export has 36 published page records and five drafts, not 41 published pages. Preserve draft state. Four draft slugs have no published record; the fifth is a draft of Current Openings.

The old redirect file has 23 active path rules, including two self-pointing rules. Keep the other 21. Hostname rules are outside this task.

The privacy policy is stored as HTML inside an `iframeEmbed`. Preserve its text and links as structured content. The directions page has a Google Maps iframe. The block inventory identifies both.

The old section and menu name is `About us`. If the new model uses `About Us`, convert both sides together.
