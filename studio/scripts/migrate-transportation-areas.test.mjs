import assert from "node:assert/strict";
import test from "node:test";
import { migrate, migrationPlan, parseArea, planBlock } from "./migrate-transportation-areas.mjs";

const paragraph = (key, text) => ({
  _key: key, _type: "block", style: "normal",
  children: [{ _key: `${key}-span`, _type: "span", text, marks: [] }],
});
const intro = [paragraph("p1", "Parents wish for a camp near them."), paragraph("p2", "Buses have seatbelts.")];
const block = {
  _key: "transport", _type: "transportation", title: "Door to Door",
  body: [
    ...intro,
    paragraph("heading", "Transportation Areas"),
    paragraph("mercer", "Mercer County: Ewing, Hamilton, West Windsor"),
    paragraph("bucks", "Bucks County: New Hope,Yardley "),
  ],
};
const page = { _id: "homePage", _rev: "rev", blocks: [{ _type: "lunch" }, block] };

test("parses one county line into a county and its towns", () => {
  assert.deepEqual(parseArea("Mercer County: Ewing, Hamilton", "a"), {
    _key: "a", _type: "area", county: "Mercer County:", towns: ["Ewing", "Hamilton"],
  });
  assert.equal(parseArea("No colon here", "a"), null);
  assert.equal(parseArea("Empty County:", "a"), null);
});

test("moves the county lines out of the body and keeps the intro", () => {
  const plan = planBlock(block, 1);
  assert.deepEqual(plan.set["blocks[1].body"], intro);
  assert.equal(plan.set["blocks[1].areasTitle"], "Transportation Areas");
  assert.deepEqual(plan.set["blocks[1].areas"].map((a) => a.county), ["Mercer County:", "Bucks County:"]);
  assert.deepEqual(plan.set["blocks[1].areas"][1].towns, ["New Hope", "Yardley"]);
});

test("leaves blocks without inline areas and other block types alone", () => {
  assert.equal(planBlock({ _type: "transportation", body: intro }, 0), null);
  assert.equal(planBlock({ _type: "lunch", body: block.body }, 0), null);
  assert.deepEqual(migrationPlan([{ _id: "x", blocks: [{ _type: "transportation", body: intro }] }]), []);
});

test("keeps areas an editor already filled in", () => {
  const filled = { ...block, areas: [{ _key: "k", _type: "area", county: "Kept:", towns: ["Town"] }] };
  assert.deepEqual(planBlock(filled, 0).set["blocks[0].areas"], filled.areas);
});

test("dry run reports and writes nothing", async () => {
  const logs = [];
  const client = {
    fetch: async (_q, _p, options) => { assert.equal(options.perspective, "raw"); return [page]; },
    transaction: () => assert.fail("dry run must not write"),
  };
  await migrate(client, { log: (line) => logs.push(line) });
  assert.match(logs[0], /would patch homePage/);
});

test("apply patches with a revision guard and is idempotent", async () => {
  const documents = structuredClone([page]);
  const patched = [];
  const client = {
    fetch: async () => documents,
    transaction: () => ({
      patch(id, build) {
        build({
          ifRevisionId(revision) { assert.equal(revision, "rev"); return this; },
          set(fields) {
            patched.push(id);
            const target = documents.find((d) => d._id === id);
            target.blocks[1] = { ...target.blocks[1], body: fields["blocks[1].body"], areasTitle: fields["blocks[1].areasTitle"], areas: fields["blocks[1].areas"] };
            return this;
          },
        });
      },
      async commit() { return { transactionId: "t" }; },
    }),
  };
  await migrate(client, { apply: true, log() {} });
  assert.deepEqual(patched, ["homePage"]);
  assert.equal(documents[0].blocks[1].body.length, 2);
  assert.deepEqual(await migrate(client, { apply: true, log() {} }), []);
});
