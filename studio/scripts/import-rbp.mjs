#!/usr/bin/env node
import { createClient } from "@sanity/client";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { transform } from "./import-rbp/transform.mjs";
import { localAssets, seedDocuments } from "./import-rbp/seed.mjs";
const studio = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const value = (flag, fallback) =>
  args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback;
const sourceFile = value(
  "--source",
  "/storage/backups/rbp/slbjn4i1-production-raw-2026-10-16T07-14-16.tar.gz",
);
const reportFile = value(
  "--report",
  path.resolve(studio, "../docs/migration/import-report.json"),
);
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
});
const entries = execFileSync("tar", ["-tzf", sourceFile], { encoding: "utf8" })
  .trim()
  .split("\n");
const dataEntry = entries.find((e) => e.endsWith("/data.ndjson"));
if (!dataEntry) throw new Error("Source export has no data.ndjson");
const source = execFileSync("tar", ["-xOzf", sourceFile, dataEntry], {
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
})
  .trim()
  .split("\n")
  .map(JSON.parse);
const oldAssets = source.filter((d) =>
  ["sanity.imageAsset", "sanity.fileAsset"].includes(d._type),
);
const assets = Object.fromEntries(oldAssets.map((a) => [a._id, a._id]));
for (const name of localAssets) assets[name] = `dry-run-${name}`;
let playbackId = env.RBP_MUX_HP_HERO_PLAYBACK_ID || env.MUX_HP_HERO_PLAYBACK_ID;
if (!playbackId) {
  const secretFile = path.join(process.env.HOME, ".config/ovs/secrets.env");
  if (existsSync(secretFile))
    playbackId = parseEnv(
      readFileSync(secretFile, "utf8"),
    ).RBP_MUX_HP_HERO_PLAYBACK_ID;
}
if (!playbackId) throw new Error("Missing RBP_MUX_HP_HERO_PLAYBACK_ID");
let result = transform(
  source,
  assets,
  seedDocuments(source, assets, playbackId),
);
let backup = null;
const assetReport = {
  source: oldAssets.length,
  local: localAssets.length,
  uploaded: 0,
  reused: 0,
};
if (apply) {
  if (result.report.unhandled.length)
    throw new Error(
      "Unhandled blocks: run a dry run and resolve them before applying",
    );
  const existing = await client.fetch(
    '*[!(_id in path("_.**"))]{_id,_type,_starterSeed,source}',
  );
  if (existing.some((d) => d._starterSeed))
    throw new Error(
      "Run pnpm unseed before --apply. Back up the dataset before unseed.",
    );
  const targetIds = new Set(result.documents.map((d) => d._id));
  const unknown = existing.filter(
    (d) => !d._type.startsWith("sanity.") && !targetIds.has(d._id),
  );
  if (unknown.length)
    throw new Error(
      `Refusing unrelated documents: ${unknown.map((d) => d._id).join(", ")}`,
    );
  mkdirSync("/storage/backups/rbp", { recursive: true });
  backup = `/storage/backups/rbp/xl6qmxch-production-before-import-${new Date().toISOString().replaceAll(":", "-")}.tar.gz`;
  execFileSync(
    "pnpm",
    ["exec", "sanity", "datasets", "export", "production", backup],
    { cwd: studio, stdio: "inherit", env: { ...process.env, ...env } },
  );
  execFileSync("gzip", ["-t", backup]);
  console.log("Target full backup passed gzip -t. Starting asset import.");
  const known = new Map(
    existing
      .filter((d) => d._type.startsWith("sanity."))
      .flatMap((d) => [
        [d._id, d._id],
        ...(d.source?.name === "rbp-old-slbjn4i1"
          ? [[d.source.id, d._id]]
          : []),
      ]),
  );
  let index = 0;
  async function uploadNext() {
    while (index < oldAssets.length) {
      const old = oldAssets[index++];
      if (known.has(old._id)) {
        assets[old._id] = known.get(old._id);
        assetReport.reused++;
        continue;
      }
      const sourceUrl = new URL(old.url);
      if (
        sourceUrl.hostname !== "cdn.sanity.io" ||
        !sourceUrl.pathname.includes("/slbjn4i1/production/")
      )
        throw new Error(`Invalid source asset URL for ${old._id}`);
      const response = await fetch(sourceUrl);
      if (!response.ok)
        throw new Error(`Asset download ${old._id}: ${response.status}`);
      const uploaded = await client.assets.upload(
        old._type === "sanity.imageAsset" ? "image" : "file",
        Buffer.from(await response.arrayBuffer()),
        {
          filename: old.originalFilename,
          contentType: old.mimeType,
          source: { id: old._id, name: "rbp-old-slbjn4i1", url: old.url },
        },
      );
      assets[old._id] = uploaded._id;
      assetReport.uploaded++;
      if (assetReport.uploaded % 20 === 0)
        console.log(`Uploaded ${assetReport.uploaded} source assets`);
    }
  }
  await Promise.all(Array.from({ length: 4 }, () => uploadNext()));
  for (const name of localAssets) {
    const uploaded = await client.assets.upload(
      "image",
      readFileSync(new URL(`./import-rbp/assets/${name}`, import.meta.url)),
      { filename: name, source: { id: name, name: "rbp-hard-coded-content" } },
    );
    assets[name] = uploaded._id;
  }
  result = transform(source, assets, seedDocuments(source, assets, playbackId));
  // All references and their targets enter the dataset in one atomic transaction.
  let transaction = client.transaction();
  for (const doc of result.documents)
    transaction = transaction.createOrReplace(JSON.parse(JSON.stringify(doc)));
  await transaction.commit();
  const stored = await client.fetch(
    "*[_id in $ids]{_id,_type}",
    { ids: result.documents.map((d) => d._id) },
    { perspective: "raw" },
  );
  if (stored.length !== result.documents.length)
    throw new Error(
      `Verification count: expected ${result.documents.length}, received ${stored.length}`,
    );
}
const report = {
  mode: apply ? "apply" : "dry-run",
  timestamp: new Date().toISOString(),
  source: sourceFile,
  target: {
    project: "xl6qmxch",
    dataset: "production",
    environment: "studio/.env.local",
  },
  backup,
  backupVerified: !!backup,
  assets: assetReport,
  ...result.report,
  notes: [
    "41 source page records include 36 published pages and 5 drafts. Draft IDs and state are preserved.",
    "The home page and interactive-map page come from the hard-coded site, not the old dataset.",
    "Cognito forms are omitted. Their surrounding text is preserved. See issue #20.",
    "Program card descriptions are kept in ageRange because the approved card schema has no separate description field.",
    "The incomplete Kenneth Kim quote is preserved as recorded in the old source.",
  ],
};
writeFileSync(reportFile, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
