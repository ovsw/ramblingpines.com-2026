#!/usr/bin/env node
// One-time fix for issue #23. The importer copied the old editor labels
// ("EmbedSocial Reviews", "Request Info Form", "Google Map") into the titles of
// the embed sections it created on pages. The old site never showed them.
// Dry run by default; `--apply` unsets those titles. A repeat run finds nothing.
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const studio = fileURLToPath(new URL("../../", import.meta.url));
const apply = process.argv.includes("--apply");
const env = parseEnv(readFileSync(path.join(studio, ".env.local"), "utf8"));
if (
  env.SANITY_STUDIO_PROJECT_ID !== "xl6qmxch" ||
  env.SANITY_STUDIO_DATASET !== "production"
)
  throw new Error(
    "Refusing target: expected xl6qmxch/production in studio/.env.local",
  );
const client = createClient({
  projectId: env.SANITY_STUDIO_PROJECT_ID,
  dataset: env.SANITY_STUDIO_DATASET,
  apiVersion: "2026-10-16",
  token: env.SANITY_AUTH_TOKEN,
  useCdn: false,
  perspective: "raw",
});

// Only imported pages: the home page map title comes from the seed.
const embedTypes = ["reviews", "hubspotForm", "locationMap"];
const pages = await client.fetch(
  `*[_type == "page" && count(blocks[_type in $types && defined(title)]) > 0]{
    _id, _rev, "keys": blocks[_type in $types && defined(title)]{_key, _type, title}
  }`,
  { types: embedTypes },
);
for (const page of pages)
  for (const block of page.keys)
    console.log(`${page._id} ${block._type} ${block._key}: "${block.title}"`);
if (!pages.length) console.log("No copied embed titles left.");
if (apply && pages.length) {
  const tx = client.transaction();
  for (const page of pages)
    tx.patch(page._id, (p) =>
      p
        .ifRevisionId(page._rev)
        .unset(page.keys.map((b) => `blocks[_key=="${b._key}"].title`)),
    );
  await tx.commit();
  console.log(`Cleared titles on ${pages.length} document(s).`);
} else if (pages.length) console.log("Dry run. Add --apply to clear them.");
