import assert from "node:assert/strict";
import test from "node:test";
import {
  getDocumentSlug,
  getPresentationPath,
  isPresentationDocumentType,
  resolveContentPath,
} from "./routes.ts";
import { resolve } from "./resolve.ts";

test("does not treat an ordinary index slug as homepage identity", () => {
  assert.equal(resolveContentPath("index"), "/index");
});

test("normalizes leading and trailing slashes", () => {
  assert.equal(resolveContentPath("///method-process///"), "/method-process");
});

test("resolves a normal page slug to a canonical path", () => {
  assert.equal(getPresentationPath("page", "about"), "/about");
  assert.equal(
    getPresentationPath("page", "staff/available-positions"),
    "/staff/available-positions",
  );
});

test("missing and empty slugs disable Presentation navigation", () => {
  assert.equal(getPresentationPath("page", undefined), null);
  assert.equal(getPresentationPath("page", ""), null);
});

test("an existing draft is authoritative when resolving its slug", () => {
  assert.equal(
    getDocumentSlug({ slug: {} }, { slug: { current: "published-path" } }),
    undefined,
  );
  assert.equal(
    getDocumentSlug(undefined, { slug: { current: "published-path" } }),
    "published-path",
  );
});

test("unsupported document types do not expose the action", () => {
  assert.equal(isPresentationDocumentType("page"), true);
  assert.equal(isPresentationDocumentType("author"), false);
});

test("matches nested page paths when Presentation follows the preview", () => {
  assert.equal(resolve.mainDocuments.at(-1).route, "/:slug(.+)");
});
