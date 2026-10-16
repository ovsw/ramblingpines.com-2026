#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { createClient } from "@sanity/client";

const directory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(directory, "..", "..");

function parseEnvValue(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const name = trimmed.slice(0, separator).trim();
    if (process.env[name] !== undefined) continue;
    process.env[name] = parseEnvValue(trimmed.slice(separator + 1));
  }
}

loadEnvFile(path.join(rootDirectory, "studio", ".env.local"));

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.SANITY_STUDIO_DATASET;
const API_VERSION = process.env.SANITY_STUDIO_API_VERSION || "2026-03-23";
const TOKEN = process.env.SANITY_AUTH_TOKEN;

export const STARTER_SEED = {
  name: "next-sanity-starter",
  version: 1,
};

// Asset IDs derive from the bundled bytes, not from any project's dataset.
export const STARTER_ASSETS = ["landscape", "square", "avatar"].map((name) => {
  const buffer = readFileSync(
    path.join(directory, "seed-assets", `${name}.png`),
  );
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return {
    name,
    buffer,
    id: `image-${createHash("sha1").update(buffer).digest("hex")}-${width}x${height}-png`,
  };
});
export const STARTER_IMAGE_ASSET_ID = STARTER_ASSETS[0].id;
const placeholder = (name) => ({
  _type: "image",
  alt: "Neutral placeholder image.",
  asset: {
    _type: "reference",
    _ref: STARTER_ASSETS.find((asset) => asset.name === name).id,
  },
});
const imageRef = placeholder("landscape");

const ref = (_ref) => ({ _type: "reference", _ref });
const slug = (current) => ({ _type: "slug", current });
const block = (key, text, style = "normal") => ({
  _key: key,
  _type: "block",
  children: [{ _key: `${key}-span`, _type: "span", marks: [], text }],
  markDefs: [],
  style,
});
const simpleText = (key, text) => [block(key, text)];
const internalUrl = (_ref) => ({
  _type: "customUrl",
  type: "internal",
  internal: ref(_ref),
  openInNewTab: false,
});
const button = (key, text, _ref, variant = "default") => ({
  _key: key,
  _type: "button",
  text,
  url: internalUrl(_ref),
  variant,
});
const meta = (title, description) => ({
  title,
  description,
  noindex: false,
  image: imageRef,
});

export const STARTER_DOCUMENT_TYPES = new Map([
  ["siteSettings", "settings"],
  ["navigation", "navigation"],
  ["footer", "footer"],
  ["homePage", "homePage"],
  ["starter-page-about", "page"],
  ["starter-faq-getting-started", "faq"],
  ["starter-team-member-editor", "teamMember"],
  ["starter-testimonial-reader", "testimonial"],
]);

// Optional samples left by the Starter before blog removal. Never seed these.
const LEGACY_STARTER_DOCUMENT_TYPES = new Map([
  ["settings", "settings"],
  ["blogIndex", "blogIndex"],
  ["blogPostSettings", "blogPostSettings"],
  ["starter-author-editor", "author"],
  ["starter-category-notes", "category"],
  ["starter-post-field-guide", "post"],
]);

const marker = {
  _starterSeed: STARTER_SEED,
};

export const starterDocuments = [
  {
    _id: "siteSettings",
    _type: "settings",
    ...marker,
    siteName: "Starter Example",
    contact: {
      _type: "contactDetails",
      email: "hello@example.com",
      phone: "+1 555 0100",
      addressLines: ["123 Example Street", "Sample City"],
    },
    socialLinks: [
      {
        _key: "starter-social",
        _type: "socialLink",
        label: "LinkedIn",
        url: "https://example.com",
      },
    ],
  },
  {
    _id: "starter-faq-getting-started",
    _type: "faq",
    ...marker,
    title: "What should this sample content prove?",
    body: simpleText(
      "starter-faq-body",
      "It proves that reusable FAQ entries can be selected and rendered.",
    ),
  },
  {
    _id: "starter-team-member-editor",
    _type: "teamMember",
    ...marker,
    name: "Morgan Example",
    role: "Content Editor",
    email: "morgan@example.com",
    phone: "+1 555 0101",
    image: placeholder("avatar"),
    bio: simpleText(
      "starter-team-bio",
      "Morgan is a neutral profile used to test team sections.",
    ),
    sortOrder: 1,
  },
  {
    _id: "starter-testimonial-reader",
    _type: "testimonial",
    ...marker,
    name: "Example Reader",
    title: "Seed content reviewer",
    image: placeholder("avatar"),
    body: simpleText(
      "starter-testimonial-body",
      "The sample content made every editing surface easy to find.",
    ),
    rating: 5,
  },
  {
    _id: "starter-page-about",
    _type: "page",
    ...marker,
    title: "About",
    description: "A neutral page used to test routed page rendering.",
    slug: slug("about"),
    blocks: [
      {
        _key: "example-form",
        _type: "hubspotForm",
        theme: "light",
        title: "Example form",
        formId: "00000000-0000-0000-0000-000000000000",
      },
      {
        _key: "example-reviews",
        _type: "reviews",
        theme: "light",
        title: "Example reviews",
        widgetId: "example",
      },
      {
        _key: "example-video",
        _type: "video",
        theme: "light",
        title: "Example video",
        url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      },
      {
        _key: "example-location",
        _type: "locationMap",
        theme: "light",
        title: "Example location",
        location: "Hopewell, New Jersey",
        address: "Hopewell, New Jersey",
      },
      {
        _key: "example-hero",
        _type: "muxVideoHero",
        theme: "light",
        title: "Example hero",
        playbackId: "example",
        heading: "Example heading",
        intro: "Replace this with camp content.",
        buttons: [button("example-hero-link", "About", "starter-page-about")],
      },
      {
        _key: "example-transportation",
        _type: "transportation",
        theme: "light",
        title: "Example transportation",
        body: simpleText(
          "example-transportation-body",
          "Replace this with transportation information.",
        ),
        image: imageRef,
      },
      {
        _key: "example-programs",
        _type: "programs",
        theme: "light",
        title: "Example programs",
        cards: [1, 2, 3, 4].map((number) => ({
          _key: `example-program-${number}`,
          _type: "programCard",
          title: `Program ${number}`,
          ageRange: "Example age range",
          icon: placeholder("square"),
          link: internalUrl("starter-page-about"),
        })),
      },
      {
        _key: "example-lunch",
        _type: "lunch",
        theme: "light",
        title: "Example lunch",
        body: simpleText(
          "example-lunch-body",
          "Replace this with lunch information.",
        ),
        image: imageRef,
      },
      {
        _key: "example-quotes",
        _type: "testimonials",
        theme: "light",
        title: "Example testimonials",
        quotes: [
          {
            _key: "example-quote",
            _type: "quote",
            quote: "Replace this with a camp testimonial.",
            name: "Example name",
          },
        ],
      },
      {
        _key: "example-map",
        _type: "interactiveMap",
        theme: "light",
        title: "Example campus map",
        campusImage: imageRef,
      },
      {
        _key: "starter-page-rich-text",
        _type: "richTextBlock",
        theme: "light",
        eyebrow: "Page",
        title: "A normal routed page",
        richText: [
          block(
            "starter-page-copy",
            "This page proves normal page routing and rich text rendering.",
          ),
          {
            _key: "starter-page-table",
            _type: "table",
            title: "Simple comparison",
            rows: [
              {
                _key: "starter-table-row-1",
                _type: "tableRow",
                cells: ["Field", "Purpose"],
              },
              {
                _key: "starter-table-row-2",
                _type: "tableRow",
                cells: ["Slug", "/about/"],
              },
            ],
          },
          {
            _key: "starter-page-callout",
            _type: "callout",
            title: "Callout",
            body: "This tests the callout object.",
          },
        ],
      },
    ],
    // A replaced Scaffold lives here. The Website never renders this array.
    blocksArchive: [
      {
        _key: "starter-page-archived-scaffold",
        _type: "scaffold",
        name: "About page intro",
        proposedSectionShape: "Short intro with an eyebrow and one paragraph.",
        richText: simpleText(
          "starter-page-archived-copy",
          "This Scaffold was replaced by the rich text section above. It must not appear on the page.",
        ),
      },
    ],
    meta: meta(
      "About | Starter Example",
      "Example metadata for a normal seeded page.",
    ),
  },
  {
    _id: "homePage",
    _type: "homePage",
    ...marker,
    title: "Starter Example",
    description: "Neutral content that proves the retained Starter model.",
    blocks: [
      {
        _key: "starter-home-intro",
        _type: "richTextBlock",
        theme: "light",
        eyebrow: "Starter seed",
        title: "Neutral sample content for a clean project.",
        richText: simpleText(
          "starter-home-intro-copy",
          "Use this optional seed to inspect the editing model, then remove it before adding real content.",
        ),
      },
      {
        _key: "starter-home-seam",
        _type: "richTextBlock",
        theme: "light",
        title: "Matching themes join at a seam.",
        richText: simpleText(
          "starter-home-seam-copy",
          "This section shares the Light theme above it, so each side contributes half its padding.",
        ),
      },
      {
        _key: "starter-home-edge",
        _type: "richTextBlock",
        theme: "dark",
        title: "A different theme forms an edge.",
        richText: simpleText(
          "starter-home-edge-copy",
          "This Dark section keeps full padding on both sides of the join.",
        ),
      },
      {
        _key: "starter-home-scaffold",
        _type: "scaffold",
        name: "Reader quotes",
        proposedSectionShape:
          "Two or three short quotes with the reader's name and role.",
        richText: simpleText(
          "starter-home-scaffold-copy",
          "The sample content made every editing surface easy to find. Example Reader, seed content reviewer.",
        ),
      },
    ],
    meta: meta(
      "Starter Example | Starter Example",
      "Neutral Starter seed content for testing page rendering and metadata.",
    ),
  },
  {
    _id: "navigation",
    _type: "navigation",
    ...marker,
    items: [
      {
        _key: "starter-nav-home",
        _type: "navigationLink",
        label: "Home",
        destination: {
          _type: "navigationDestination",
          kind: "internal",
          internal: ref("homePage"),
          openInNewTab: false,
        },
      },
      {
        _key: "starter-nav-about",
        _type: "navigationLink",
        label: "About",
        destination: {
          _type: "navigationDestination",
          kind: "internal",
          internal: ref("starter-page-about"),
          openInNewTab: false,
        },
      },
    ],
    actions: [
      {
        _key: "starter-nav-action",
        _type: "navigationAction",
        label: "About",
        destination: {
          _type: "navigationDestination",
          kind: "internal",
          internal: ref("starter-page-about"),
          openInNewTab: false,
        },
      },
    ],
  },
  {
    _id: "footer",
    _type: "footer",
    ...marker,
    intro: "Neutral footer copy for the optional Starter seed.",
    columns: [
      {
        _key: "starter-footer-main",
        _type: "footerColumn",
        heading: "Content",
        links: [
          {
            _key: "starter-footer-home",
            _type: "footerLink",
            label: "Home",
            destination: {
              _type: "footerDestination",
              kind: "internal",
              internal: ref("homePage"),
              openInNewTab: false,
            },
          },
        ],
      },
    ],
    legalLinks: [],
    copyrightStartYear: 2026,
    copyrightOwner: "Starter Example",
  },
];

function requireEnv(name, value) {
  if (!value?.trim()) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function createSanitySeedClient() {
  return createClient({
    projectId: requireEnv("SANITY_STUDIO_PROJECT_ID", PROJECT_ID),
    dataset: requireEnv("SANITY_STUDIO_DATASET", DATASET),
    apiVersion: API_VERSION,
    token: requireEnv("SANITY_AUTH_TOKEN", TOKEN),
    useCdn: false,
  });
}

async function assertDatasetIsEmpty(client) {
  const count = await client.fetch('count(*[!(_id in path("_.**"))])');
  if (count !== 0) {
    throw new Error(
      `Seed refused: destination dataset is not empty (${count} documents found).`,
    );
  }
}

function assertOwnedDocument(document) {
  const expectedType =
    STARTER_DOCUMENT_TYPES.get(document?._id) ??
    LEGACY_STARTER_DOCUMENT_TYPES.get(document?._id);
  if (!expectedType || document._type !== expectedType) return false;
  return (
    document._starterSeed?.name === STARTER_SEED.name &&
    document._starterSeed?.version === STARTER_SEED.version
  );
}

async function getStarterDocuments(client) {
  return client.fetch("*[_id in $ids]{_id,_type,_starterSeed}", {
    ids: [
      ...STARTER_DOCUMENT_TYPES.keys(),
      ...LEGACY_STARTER_DOCUMENT_TYPES.keys(),
    ],
  });
}

async function assertOwnedSeedSet(client) {
  const documents = await getStarterDocuments(client);
  const foundIds = new Set(documents.map((document) => document._id));
  const missing = [...STARTER_DOCUMENT_TYPES.keys()].filter(
    (id) =>
      !foundIds.has(id) && !(id === "siteSettings" && foundIds.has("settings")),
  );
  if (missing.length) {
    throw new Error(
      `Unseed refused: missing Starter seed documents: ${missing.join(", ")}.`,
    );
  }
  const unsafe = documents.filter((document) => !assertOwnedDocument(document));
  if (unsafe.length) {
    throw new Error(
      `Unseed refused: these IDs are not marked as Starter seed content: ${unsafe.map((document) => document._id).join(", ")}.`,
    );
  }
  return [
    ...STARTER_DOCUMENT_TYPES.keys(),
    ...LEGACY_STARTER_DOCUMENT_TYPES.keys(),
  ].filter((id) => foundIds.has(id));
}

export async function seed(client) {
  await assertDatasetIsEmpty(client);
  let serialized = JSON.stringify(starterDocuments);
  const assetIds = [];
  for (const source of STARTER_ASSETS) {
    const asset = await client.assets.upload("image", source.buffer, {
      filename: `starter-${source.name}.png`,
      contentType: "image/png",
    });
    assetIds.push(asset._id);
    serialized = serialized.replaceAll(source.id, asset._id);
  }
  const documents = JSON.parse(serialized);
  let transaction = client.transaction();
  for (const document of documents) {
    transaction = transaction.createIfNotExists(document);
  }
  await transaction.commit();
  return { documents: documents.length, assetIds };
}

export async function unseed(client) {
  const documentIds = await assertOwnedSeedSet(client);
  // Never delete replacement images uploaded by an editor.
  const assetIds = STARTER_ASSETS.map((asset) => asset.id);
  let transaction = client.transaction();
  for (const id of [...documentIds, ...assetIds]) {
    transaction = transaction.delete(id);
  }
  await transaction.commit();
  return { documents: documentIds.length, assets: assetIds.length };
}

async function main() {
  const command = process.argv[2] ?? "seed";
  const client = createSanitySeedClient();
  if (command === "seed") {
    const result = await seed(client);
    console.log(`Seeded ${result.documents} Starter documents.`);
    return;
  }
  if (command === "unseed") {
    const result = await unseed(client);
    console.log(
      `Removed ${result.documents} Starter documents and ${result.assets} asset(s).`,
    );
    return;
  }
  throw new Error(`Unknown command: ${command}`);
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
