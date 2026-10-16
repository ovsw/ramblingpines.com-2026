# Rambling Pines content import

Architectural: yes. This script maps the old stored content to the approved camp schemas in issue #5, decision 12.

Run from the repository root. The script reads `studio/.env.local` and refuses any target except `xl6qmxch/production`. Python 3 handles the old policy HTML with its standard HTML parser. The Mux playback ID comes from `RBP_MUX_HP_HERO_PLAYBACK_ID` in the Studio environment or the local OVS secrets file. No credentials enter the report.

```sh
node studio/scripts/import-rbp.mjs --report /tmp/rbp-dry-run.json
```

The default source is the raw export named in issue #5. Use `--source /absolute/path/export.tar.gz` to choose another export. A dry run reads local files only and reports counts, draft IDs, dropped Cognito embeds and unhandled block types. An apply run refuses unhandled blocks or unrelated target documents.

Before removing samples, export the full target from the Studio workspace and check it with `gzip -t`. Then run `pnpm unseed`. The guarded cleanup also recognizes the five marked blog samples left by the original Starter seed. It refuses unmarked records or records of another type.

```sh
node studio/scripts/import-rbp.mjs --apply
```

Apply creates another full timestamped backup under `/storage/backups/rbp/` and checks it with `gzip -t` before uploading anything. A failed backup stops the run. Source assets come from the old Sanity CDN. The importer matches existing assets by their original asset ID or stored source metadata. Local seed images use Sanity's content-based asset IDs. A repeated run reuses assets and replaces the same content IDs. It also replaces later editor changes, so do not repeat it after editing starts.

All content records are committed in one transaction after asset uploads. If an upload fails, some unused assets can remain; no partial page set is committed. Rerun after correcting the failure. Imported drafts retain their `drafts.` IDs and remain drafts.

The apply report is saved to `docs/migration/import-report.json`. It records the backup path, target, counts, skipped types and each dropped embed. The raw export and backup stay outside git. Fixtures contain only public old-site content needed by the tests.

Legacy section names map to the current choices: `About us` becomes `About Us`, and `No Section` becomes `none`. Missing or empty sections also become `none`. The six records imported before the `No Section` correction received a field-only patch after a verified raw backup. `docs/migration/section-correction-report.json` records that correction, including the three preserved drafts.

Embed sections made from old `iframeEmbed` and `hubSpotFormEmbed` blocks get no title: the old editor labels were never shown on the site. The first import copied them. Issue #23 cleared them on the live pages with `node studio/scripts/import-rbp/clear-embed-titles.mjs --apply` after a verified raw backup. A run without `--apply` lists any copied titles that remain.

The source corrections from issue #9 apply: 41 old page records include 36 published records and five drafts, and 21 redirects survive the two self-redirect exclusions. The importer also creates `homePage` and the hard-coded interactive-map page. Site settings retain the old `siteSettings` ID; the Website query and Studio editor use that ID.

The seed JSON was extracted from `docs/migration/hard-coded-content.md`. Images and the four SVG icons came from the same old source revision. JSX-only icon attributes were removed. The approved program card schema has no description field, so each original card description is retained in `ageRange`. Transportation areas are retained as paragraphs in its simple rich text body. The second lunch link is retained in its body. These field limits need attention when the home page renderer is built.

Run the focused checks with:

```sh
node --test studio/scripts/import-rbp/transform.test.mjs studio/scripts/seed.test.mjs
```
