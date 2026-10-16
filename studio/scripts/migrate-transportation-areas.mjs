#!/usr/bin/env node
// Run from studio: node --env-file=.env.local scripts/migrate-transportation-areas.mjs
// Add --apply only after the backup steps in docs/agents/sanity-cli.md.
//
// The first build kept the Transportation county lists inside the section's
// rich-text body, after a paragraph that reads "Transportation Areas". This
// moves them into the structured `areasTitle` and `areas` fields.
import { pathToFileURL } from "node:url";

const AREAS_HEADING = "Transportation Areas";

function blockText(block) {
  if (block?._type !== "block") return "";
  return (block.children ?? [])
    .map((child) => (child._type === "span" ? child.text : ""))
    .join("");
}

/** Split one county line, "Mercer County: Ewing, Hamilton", into an area. */
export function parseArea(text, key) {
  const split = text.indexOf(":");
  if (split < 0) return null;
  const county = text.slice(0, split).trim();
  const towns = text
    .slice(split + 1)
    .split(",")
    .map((town) => town.trim())
    .filter(Boolean);
  if (!county || !towns.length) return null;
  return { _key: key, _type: "area", county, towns };
}

/** Drop a trailing colon left by the first migration run. */
export function cleanCounty(county) {
  return typeof county === "string" ? county.replace(/:\s*$/, "").trim() : county;
}

/** The patch for one transportation block, or null when nothing needs to move. */
export function planBlock(block, index) {
  if (block?._type !== "transportation") return null;
  const path = `blocks[${index}]`;
  const set = {};
  const body = Array.isArray(block.body) ? block.body : [];
  const start = body.findIndex(
    (entry) => blockText(entry).trim() === AREAS_HEADING,
  );
  if (start >= 0) {
    const tail = body.slice(start + 1);
    const parsed = tail.map((entry, i) =>
      parseArea(blockText(entry).trim(), `area-${i}`),
    );
    const areas = parsed.filter(Boolean);
    // Paragraphs after the heading that are not county lines stay in the body.
    const leftover = tail.filter((_, i) => !parsed[i]);
    if (areas.length) {
      set[`${path}.body`] = [...body.slice(0, start), ...leftover];
      set[`${path}.areasTitle`] = block.areasTitle ?? AREAS_HEADING;
      set[`${path}.areas`] = block.areas?.length ? block.areas : areas;
    }
  }
  const areas = set[`${path}.areas`] ?? block.areas;
  if (
    Array.isArray(areas) &&
    areas.some((area) => cleanCounty(area.county) !== area.county)
  ) {
    set[`${path}.areas`] = areas.map((area) => ({
      ...area,
      county: cleanCounty(area.county),
    }));
  }
  return Object.keys(set).length ? { set } : null;
}

export function migrationPlan(documents) {
  return documents.flatMap((document) => {
    const set = {};
    (document.blocks ?? []).forEach((block, index) => {
      const plan = planBlock(block, index);
      if (plan) Object.assign(set, plan.set);
    });
    return Object.keys(set).length
      ? [{ id: document._id, revision: document._rev, set }]
      : [];
  });
}

const DOCUMENTS_QUERY = `*[defined(blocks) && count(blocks[_type == "transportation"]) > 0]`;

export async function migrate(client, { apply = false, log = console.log } = {}) {
  const documents = await client.fetch(DOCUMENTS_QUERY, {}, { perspective: "raw" });
  const changes = migrationPlan(documents);
  for (const change of changes) {
    log(`${apply ? "patch" : "would patch"} ${change.id}: set ${Object.keys(change.set).join(", ")}`);
  }
  log(`${changes.length} of ${documents.length} documents need changes.`);
  if (!apply || !changes.length) return changes;
  const transaction = client.transaction();
  for (const change of changes) {
    if (!change.revision) throw new Error(`Missing revision for ${change.id}`);
    transaction.patch(change.id, (patch) =>
      patch.ifRevisionId(change.revision).set(change.set),
    );
  }
  const result = await transaction.commit();
  log(`Committed transaction ${result.transactionId}.`);
  return changes;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--apply")) throw new Error("Usage: migrate-transportation-areas.mjs [--apply]");
  const { getCliClient } = await import("sanity/cli");
  const client = getCliClient({ apiVersion: "2026-03-23" }).withConfig({ useCdn: false });
  const { projectId, dataset } = client.config();
  console.log(`Target: ${projectId}/${dataset}. Environment: studio/.env.local and shell overrides.`);
  await migrate(client, { apply: args.includes("--apply") });
}
