import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const url = (external) => ({
  _type: "customUrl",
  type: "external",
  external,
  openInNewTab: false,
});
export const text = (value, key = "text") => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-span`, text: value, marks: [] }],
});
export function policyToBlocks(html) {
  return JSON.parse(
    execFileSync(
      "python3",
      [fileURLToPath(new URL("./html-to-portable-text.py", import.meta.url))],
      { input: html, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
    ),
  );
}
export function image(value, assets) {
  if (!value?.asset?._ref) return undefined;
  const mapped = assets[value.asset._ref];
  if (!mapped) throw new Error(`Unmatched asset ${value.asset._ref}`);
  return {
    ...value,
    _type: "image",
    alt: value.alt || value.caption || "Rambling Pines Day Camp",
    asset: { _type: "reference", _ref: mapped },
  };
}
export function portable(block) {
  return {
    ...block,
    markDefs: (block.markDefs || []).map((mark) =>
      mark._type === "link"
        ? { _key: mark._key, _type: "customLink", customLink: url(mark.href) }
        : mark,
    ),
  };
}
export function convertBody(page, assets, report) {
  const sections = [];
  let body = [];
  const flush = () => {
    if (body.length) {
      sections.push({
        _key: `rich-${sections.length}`,
        _type: "richTextBlock",
        theme: "light",
        richText: body,
      });
      body = [];
    }
  };
  const add = (block) => {
    flush();
    sections.push({ theme: "light", ...block });
  };
  for (const b of page.body || []) {
    switch (b._type) {
      case "block":
        body.push(portable(b));
        break;
      case "mainImage":
        body.push(image(b, assets));
        break;
      case "mytable":
        body.push({
          _key: b._key,
          _type: "table",
          title: b.title,
          rows: b.generictable.rows.map((r) => ({ ...r, _type: "tableRow" })),
        });
        break;
      case "localFile": {
        if (!assets[b.asset._ref])
          throw new Error(`Unmatched asset ${b.asset._ref}`);
        body.push({
          ...b,
          _type: "fileDownload",
          asset: { _type: "reference", _ref: assets[b.asset._ref] },
        });
        break;
      }
      case "youtube":
        body.push({ ...b });
        break;
      case "hubSpotFormEmbed":
        add({
          _key: b._key,
          _type: "hubspotForm",
          title: b.title,
          formId: b.formId,
        });
        break;
      case "iframeEmbed": {
        if (b.cognitoForm || /cognitoforms\.com/i.test(b.code)) {
          report.droppedCognito.push({
            id: page._id,
            path: `/${page.slug.current}/`,
            key: b._key,
            title: b.title,
          });
        } else if (b.embedSocial) {
          const widgetId = b.code.match(/data-ref=["']([^"']+)["']/)?.[1];
          if (!widgetId) throw new Error(`Missing widget ID on ${page._id}`);
          add({ _key: b._key, _type: "reviews", title: b.title, widgetId });
        } else if (/google\.com\/maps\/embed/.test(b.code)) {
          add({
            _key: b._key,
            _type: "locationMap",
            title: b.title,
            location: b.code
              .match(/src=["']([^"']+)["']/)[1]
              .replaceAll("&amp;", "&"),
            address:
              "174 Lambertville Hopewell Rd.\nHopewell, NJ 08525\nUnited States",
          });
        } else if (page._id.replace(/^drafts\./, "") === "privacyPolicy") {
          body.push(...policyToBlocks(b.code));
        } else
          report.unhandled.push({ id: page._id, key: b._key, type: b._type });
        break;
      }
      default:
        report.unhandled.push({ id: page._id, key: b._key, type: b._type });
    }
  }
  flush();
  return sections;
}
export function transform(source, assets, seedDocuments = []) {
  const report = {
    sourceCounts: {},
    counts: {},
    draftIds: [],
    droppedCognito: [],
    unhandled: [],
    skipped: {},
  };
  const documents = [];
  for (const old of source) {
    report.sourceCounts[old._type] = (report.sourceCounts[old._type] || 0) + 1;
    if (old._type === "page") {
      const page = {
        _id: old._id,
        _type: "page",
        title: old.title,
        slug: old.slug,
        section:
          old.section === "About us" ? "About Us" : old.section || "none",
        blocks: convertBody(old, assets, report),
        meta: {
          title: old.seoTitle || old.title,
          description: old.seoDescription,
        },
      };
      if (old.headerImage) page.headerImage = image(old.headerImage, assets);
      documents.push(page);
    } else if (old._type === "mapMarker") {
      documents.push({
        _id: old._id,
        _type: "mapMarker",
        title: old.title,
        x: old.x,
        y: old.y,
        labelDirection: old.labelDirection,
        description: old.description,
        images: (old.images || []).map((i) => image(i, assets)),
      });
    } else if (old._type === "siteSettings") {
      documents.push({
        _id: old._id,
        _type: "settings",
        siteName: old.title,
        description: old.description,
        alertBar: {
          enabled: !!old.alertToggle,
          text: (old.alertText || []).map(portable),
        },
      });
    } else if (!old._type.startsWith("sanity."))
      report.skipped[old._type] = (report.skipped[old._type] || 0) + 1;
  }
  for (const seed of seedDocuments) {
    const existing = documents.find((d) => d._id === seed._id);
    if (existing) Object.assign(existing, seed);
    else documents.push(seed);
  }
  for (const d of documents) {
    report.counts[d._type] = (report.counts[d._type] || 0) + 1;
    if (d._id.startsWith("drafts.")) report.draftIds.push(d._id);
  }
  return { documents, report };
}
