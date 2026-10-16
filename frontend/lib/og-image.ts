import brand from "../public/brand/brand.json";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const OG_IMAGE_VERSION = "3";

const MAX_SLUG_LENGTH = 200;
const SIGNATURE_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const SLUG_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9/_-]*[A-Za-z0-9])?$/;

type SignaturePayload = {
  slug: string;
  revision: string;
  version?: string;
};

export type OgImageIdentity = {
  key: string;
  revision: string;
  version?: string;
};

function signaturePayload({
  slug,
  revision,
  version = OG_IMAGE_VERSION,
}: SignaturePayload) {
  return `${version}\n${slug}\n${revision}`;
}

export function createOgImageRevision(parts: string[]) {
  return createHash("sha256")
    .update(JSON.stringify(brand))
    .update(parts.join("\n"))
    .digest("base64url")
    .slice(0, 22);
}

export function isValidOgSlug(slug: string) {
  return (
    slug.length > 0 &&
    slug.length <= MAX_SLUG_LENGTH &&
    !slug.includes("//") &&
    SLUG_PATTERN.test(slug)
  );
}

export function signOgImage(identity: OgImageIdentity, secret: string) {
  return createHmac("sha256", secret)
    .update(
      signaturePayload({
        slug: identity.key,
        revision: identity.revision,
        version: identity.version,
      }),
    )
    .digest("base64url");
}

export function verifyOgImageSignature({
  identity,
  secret,
  signature,
}: {
  identity: OgImageIdentity;
  secret: string;
  signature: string;
}) {
  if (!SIGNATURE_PATTERN.test(signature)) return false;

  const expected = Buffer.from(signOgImage(identity, secret), "base64url");
  const received = Buffer.from(signature, "base64url");

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export function getOgImageSecret() {
  const secret = process.env.OG_IMAGE_SECRET;
  if (!secret) throw new Error("OG_IMAGE_SECRET is required");
  return secret;
}

export function fitOgTitle(value: string) {
  const title = value.trim();
  if (title.length <= 96) {
    return { text: title, fontSize: title.length > 76 ? 46 : 54 };
  }

  const candidate = title.slice(0, 95);
  const lastSpace = candidate.lastIndexOf(" ");
  const text = `${candidate.slice(0, lastSpace > 70 ? lastSpace : 95).trim()}…`;
  return { text, fontSize: 46 };
}
