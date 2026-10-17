#!/usr/bin/env node
// One-time content change for issue #29. The importer flattened the old menu,
// so the seven sub-pages of Programs and Activities sat at the top level of
// the Future Families group. This moves them under their parents as
// `navigationSubLink` children. Dry run by default; `--apply` writes. A repeat
// run finds nothing to do.
import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

// Parent label -> child labels, in the old site's order (gatsby-config siteNav).
const nesting = {
  Programs: ["Pine Cone Camp", "Day Camp", "Teen Camp"],
  Activities: ["Clubs & Electives", "Learn to Swim", "Calendar", "Special Events"],
};

const doc = await client.getDocument("navigation");
if (!doc) throw new Error("navigation document not found");
const group = (doc.items ?? []).find(
  (item) => item._type === "navigationGroup" && item.label === "Future Families",
);
if (!group) throw new Error("Future Families group not found");

const byLabel = new Map(group.links.map((link) => [link.label, link]));
const childLabels = new Set(Object.values(nesting).flat());
const alreadyNested = group.links.every((link) => !childLabels.has(link.label));
if (alreadyNested) {
  console.log("Nothing to do: the sub-pages are already nested.");
  process.exit(0);
}
for (const label of [...Object.keys(nesting), ...childLabels]) {
  if (!byLabel.has(label)) throw new Error(`Link not found at top level: ${label}`);
}
// Stop rather than overwrite sub-links an editor added by hand.
for (const label of Object.keys(nesting)) {
  if (byLabel.get(label).children?.length)
    throw new Error(`${label} already has sub-links; nest the rest by hand.`);
}

const links = group.links
  .filter((link) => !childLabels.has(link.label))
  .map((link) =>
    nesting[link.label]
      ? {
          ...link,
          children: nesting[link.label].map((label) => {
            const child = byLabel.get(label);
            return {
              _key: child._key,
              _type: "navigationSubLink",
              label: child.label,
              destination: child.destination,
            };
          }),
        }
      : link,
  );

console.log(
  links
    .map((l) => `${l.label}${l.children ? "\n  - " + l.children.map((c) => c.label).join("\n  - ") : ""}`)
    .join("\n"),
);

if (!apply) {
  console.log("\nDry run. Pass --apply to write.");
  process.exit(0);
}

const backupDir = "/storage/backups/rbp";
mkdirSync(backupDir, { recursive: true });
const backup = path.join(backupDir, `navigation-before-nesting-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
writeFileSync(backup, JSON.stringify(doc, null, 2));
console.log(`Backup: ${backup}`);

const groupIndex = doc.items.indexOf(group);
await client
  .patch("navigation")
  .ifRevisionId(doc._rev)
  .set({ [`items[${groupIndex}].links`]: links })
  .commit();
console.log("Applied.");
