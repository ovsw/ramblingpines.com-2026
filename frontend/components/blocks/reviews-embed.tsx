"use client";

import Script from "next/script";
import { useRef, useState } from "react";

export default function ReviewsEmbed({ widgetId }: { widgetId: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  function loadWidget() {
    const api = (window as Window & {
      EMBEDSOCIALREVIEWS?: {
        getEmbedData: (id: string, container: HTMLElement) => void;
      };
    }).EMBEDSOCIALREVIEWS;
    // The script scans on first load. Initialize new hosts after navigation
    // or a Studio edit too. The vendor skips hosts that already have an iframe.
    if (host.current && api) api.getEmbedData(widgetId, host.current);
  }

  return (
    <>
      <div ref={host} className="embedsocial-reviews" data-ref={widgetId} />
      <Script
        src="https://embedsocial.com/embedscript/ri.js"
        onReady={loadWidget}
        onError={() => setFailed(true)}
      />
      {failed ? <p role="status">Reviews could not load. Please reload the page.</p> : null}
      <noscript>Please enable JavaScript to read the reviews.</noscript>
    </>
  );
}
