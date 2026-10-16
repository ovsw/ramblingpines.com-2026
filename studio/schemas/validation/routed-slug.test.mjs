import assert from "node:assert/strict";
import test from "node:test";

import { uniqueRoutedSlug } from "./routed-slug.ts";

function context(document, collision = null, inspectFetch = () => {}) {
  const client = {
    fetch: async (query, params) => {
      inspectFetch(query, params);
      return collision;
    },
    withConfig: () => client,
  };
  return { document, getClient: () => client };
}

test("accepts one clean segment and checks uniqueness within its route type", async () => {
  assert.equal(
    await uniqueRoutedSlug(
      { current: "about" },
      context({ _id: "drafts.page-id", _type: "page" }),
    ),
    true,
  );
  assert.match(
    await uniqueRoutedSlug(
      { current: "about" },
      context(
        { _id: "drafts.page-id", _type: "page" },
        { _id: "other-page", slug: "about" },
      ),
    ),
    /already used by another page/,
  );
});

test("checks legacy surrounding-slash variants for route collisions", async () => {
  let observed;
  await uniqueRoutedSlug(
    { current: "about" },
    context({ _id: "drafts.page-id", _type: "page" }, null, (query, params) => {
      observed = { query, params };
    }),
  );

  assert.match(observed.query, /slug\.current in \[\$slug, "\/" \+ \$slug/);
  assert.equal(observed.params.slug, "about");
});

test("accepts nested page slugs", async () => {
  const pageContext = context({ _id: "page-id", _type: "page" });

  assert.equal(
    await uniqueRoutedSlug(
      { current: "staff/available-positions" },
      pageContext,
    ),
    true,
  );
});

test("rejects malformed and application-owned slugs", async () => {
  const pageContext = context({ _id: "page-id", _type: "page" });

  assert.match(
    await uniqueRoutedSlug({ current: "Blog" }, pageContext),
    /lowercase/,
  );
  assert.match(
    await uniqueRoutedSlug({ current: "/nested/page/" }, pageContext),
    /no leading or trailing slash/,
  );
  assert.match(
    await uniqueRoutedSlug({ current: "api" }, pageContext),
    /reserved/,
  );
});
