import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { transform, convertBody, policyToBlocks } from "./transform.mjs";
import { seedDocuments, localAssets } from "./seed.mjs";
const source = JSON.parse(
  readFileSync(new URL("./fixtures/source.json", import.meta.url), "utf8"),
);
const assets = {};
function scan(value) {
  if (!value || typeof value !== "object") return;
  if (value._ref?.match(/^(image|file)-/))
    assets[value._ref] = `matched-${value._ref}`;
  Object.values(value).forEach(scan);
}
scan(source);
const run = () => transform(source, assets);
test("maps legacy section names and preserves supported navigation groups", () => {
  for (const [section, expected] of [
    ["No Section", "none"],
    ["About us", "About Us"],
    [undefined, "none"],
    ["", "none"],
    ["none", "none"],
    ["Future Families", "Future Families"],
    ["About Us", "About Us"],
    ["Current Families", "Current Families"],
    ["Staff", "Staff"],
  ]) {
    const { documents } = transform(
      [{ _id: "section-fixture", _type: "page", section }],
      {},
    );
    assert.equal(documents[0].section, expected);
  }
});
test("preserves document IDs and remaps image and file references across inline content and markers", () => {
  const { documents } = run();
  const page = documents.find((d) => d._id === "inline-fixture");
  assert.equal(page.slug.current, "inline-fixture");
  const blocks = page.blocks[0].richText;
  assert.deepEqual(
    blocks.map((b) => b._type),
    ["block", "image", "table", "fileDownload", "youtube"],
  );
  assert.ok(blocks[1].asset._ref.startsWith("matched-image-"));
  assert.ok(blocks[3].asset._ref.startsWith("matched-file-"));
  assert.equal(blocks[2].rows[0]._type, "tableRow");
  const old = source.find((d) => d._type === "mapMarker");
  const marker = documents.find((d) => d._id === old._id);
  assert.equal(marker.x, old.x);
  assert.equal(marker.y, old.y);
  assert.equal(marker.labelDirection, old.labelDirection);
  assert.equal(marker.images[0].asset._ref, assets[old.images[0].asset._ref]);
  assert.deepEqual(marker.description, old.description);
});
test("splits text before and after HubSpot, keeps the form ID and title", () => {
  const form = source
    .flatMap((d) => d.body || [])
    .find((b) => b._type === "hubSpotFormEmbed");
  assert.ok(form);
  const paragraph = source.find((d) => d._id === "inline-fixture").body[0];
  const sections = convertBody(
    { _id: "split", body: [paragraph, form, paragraph] },
    assets,
    { droppedCognito: [], unhandled: [] },
  );
  assert.deepEqual(
    sections.map((s) => s._type),
    ["richTextBlock", "hubspotForm", "richTextBlock"],
  );
  assert.equal(sections[1].formId, "39da88d2-691e-4998-8544-d4d3c42fd692");
  assert.deepEqual(sections[0].richText, sections[2].richText);
});
test("drops Cognito and keeps surrounding text, counts and skipped types", () => {
  const { documents, report } = run();
  const old = source.find((d) => d._id === "workingAtRBP");
  const page = documents.find((d) => d._id === old._id);
  assert.equal(
    page.blocks.flatMap((b) => b.richText || []).length,
    old.body.filter((b) => b._type !== "iframeEmbed").length,
  );
  assert.equal(report.droppedCognito[0].id, "workingAtRBP");
  assert.equal(report.unhandled.length, 0);
  assert.equal(report.skipped.post, 1);
  assert.equal(
    report.counts.page,
    source.filter((d) => d._type === "page").length,
  );
  assert.equal(report.counts.settings, 1);
  assert.equal(report.counts.mapMarker, 1);
  assert.equal(
    documents.some((d) => d._type === "post"),
    false,
  );
});
test("keeps the old settings ID, alert text, enabled state and links", () => {
  const settings = run().documents.find((d) => d._id === "siteSettings");
  const old = source.find((d) => d._id === "siteSettings");
  assert.equal(settings.siteName, old.title);
  assert.equal(settings.alertBar.enabled, old.alertToggle);
  assert.equal(settings.alertBar.text[0].markDefs[0]._type, "customLink");
  assert.equal(
    settings.alertBar.text[0].markDefs[0].customLink.external,
    old.alertText[0].markDefs[0].href,
  );
});
test("preserves draft identity without publishing and refuses missing assets", () => {
  const old = source.find((d) => d._type === "mapMarker");
  assert.deepEqual(
    transform([{ ...old, _id: `drafts.${old._id}` }], assets).report.draftIds,
    [`drafts.${old._id}`],
  );
  assert.throws(() => transform([old], {}), /Unmatched asset/);
});
test("converts policy headings, lists, bold and links without style or script attributes", () => {
  const blocks = policyToBlocks(
    '<style>bad</style><h2 class="x">Title</h2><p style="color:red">A <b>bold</b> <a href="https://example.org" onclick="bad()">link</a></p><ul><li>One</li></ul><script>bad()</script>',
  );
  assert.deepEqual(
    blocks.map((b) => b.style),
    ["h2", "normal", "normal"],
  );
  assert.equal(blocks[2].listItem, "bullet");
  assert.ok(
    blocks[1].children.some(
      (c) => c.text === "bold" && c.marks.includes("strong"),
    ),
  );
  assert.equal(
    blocks[1].markDefs[0].customLink.external,
    "https://example.org",
  );
  assert.doesNotMatch(JSON.stringify(blocks), /onclick|color:red|bad\(/);
  const policy = run().documents.find((d) => d._id === "privacyPolicy");
  assert.ok(policy.blocks[0].richText.length > 20);
  assert.ok(policy.blocks[0].richText.some((b) => b.style === "h2"));
});
test("recognizes the unflagged directions map and reports unknown blocks", () => {
  const page = run().documents.find((d) => d._id === "directions");
  assert.ok(
    page.blocks.some(
      (b) =>
        b._type === "locationMap" &&
        b.location.startsWith("https://www.google.com/maps/embed"),
    ),
  );
  const { report } = transform(
    [
      {
        _type: "page",
        _id: "unknown",
        body: [{ _key: "a", _type: "unknown" }],
      },
    ],
    {},
  );
  assert.deepEqual(report.unhandled, [
    { id: "unknown", key: "a", type: "unknown" },
  ]);
});

test("seeds six home sections and only non-self redirects with valid targets", () => {
  const seed = JSON.parse(
    readFileSync(new URL("./seed.json", import.meta.url), "utf8"),
  );
  const pages = [...new Set(seed.redirects.map(([, to]) => to))].map(
    (to, i) => ({
      _id: `route-${i}`,
      _type: "page",
      slug: { _type: "slug", current: to.slice(1, -1) },
    }),
  );
  const assetMap = Object.fromEntries(
    localAssets.map((name) => [name, `image-${name}`]),
  );
  const documents = seedDocuments(pages, assetMap, "playback123");
  assert.deepEqual(
    documents.find((d) => d._type === "homePage").blocks.map((b) => b._type),
    [
      "muxVideoHero",
      "transportation",
      "programs",
      "lunch",
      "locationMap",
      "testimonials",
    ],
  );
  const redirects = documents.filter((d) => d._type === "redirect");
  assert.equal(redirects.length, 21);
  for (const redirect of redirects) {
    const target = pages.find(
      (p) => p._id === redirect.destinationReference._ref,
    );
    assert.ok(target);
    assert.notEqual(redirect.source.current, `/${target.slug.current}/`);
  }
  const home = documents.find((d) => d._type === "homePage");
  assert.equal(home.blocks[2].cards.length, 4);
  assert.equal(home.blocks[5].quotes.length, 7);
});
