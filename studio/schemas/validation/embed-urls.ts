export function validateYouTubeUrl(value: unknown) {
  if (!value) return true;
  try {
    const url = new URL(String(value));
    return url.protocol === "https:" &&
      ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(
        url.hostname,
      )
      ? true
      : "Use a YouTube HTTPS URL";
  } catch {
    return "Use a YouTube HTTPS URL";
  }
}
export function validateGoogleMap(value: unknown) {
  if (!value) return true;
  const text = String(value).trim();
  if (!text) return "Enter a place query or Google Maps URL";
  if (/^[a-z][a-z0-9+.-]*:/i.test(text) && !/^https:/i.test(text))
    return "Use a Google Maps HTTPS URL";
  if (/[<>]/.test(text)) return "Enter a place query or URL, not embed code";
  if (!/^https?:/i.test(text)) return true;
  try {
    const url = new URL(text);
    return url.protocol === "https:" &&
      ["google.com", "www.google.com", "maps.google.com"].includes(
        url.hostname,
      ) &&
      /^\/maps(?:\/|$)/.test(url.pathname)
      ? true
      : "Use a Google Maps HTTPS URL";
  } catch {
    return "Use a Google Maps URL or place query";
  }
}
