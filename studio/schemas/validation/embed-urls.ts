const youTubeHosts = ["youtube.com", "www.youtube.com", "m.youtube.com"];
const youTubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;

/** Mirrors the video ID extraction in the frontend YouTube renderers. */
function youTubeVideoId(url: URL) {
  if (url.hostname === "youtu.be") return url.pathname.split("/")[1];
  if (!youTubeHosts.includes(url.hostname)) return null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  if (/^\/(embed|shorts|live)\//.test(url.pathname))
    return url.pathname.split("/")[2];
  return null;
}

export function validateYouTubeUrl(value: unknown) {
  if (!value) return true;
  try {
    const url = new URL(String(value));
    if (url.protocol !== "https:") return "Use a YouTube HTTPS URL";
    const id = youTubeVideoId(url);
    return id && youTubeIdPattern.test(id)
      ? true
      : "Use a YouTube video link, such as https://www.youtube.com/watch?v=VIDEO_ID";
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
