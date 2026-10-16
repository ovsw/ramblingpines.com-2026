"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

type HubspotApi = {
  forms: {
    create: (options: {
      portalId: string;
      formId: string;
      target: string;
      formInstanceId: string;
      css: string;
      cssClass: string;
      onFormReady: () => void;
    }) => void;
  };
};

export default function HubspotEmbed({ portalId, formId }: {
  portalId: string;
  formId: string;
}) {
  const instanceId = useId();
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const configured = Boolean(portalId && formId);

  useEffect(() => {
    if (!configured) return;
    let active = true;
    const timeout = window.setTimeout(() => setFailed(true), 20000);
    const container = host.current;
    // Each effect gets its own target, so an old asynchronous callback cannot
    // insert a form into a new instance after navigation or a preview edit.
    const target = document.createElement("div");
    target.id = `hubspot-${instanceId.replace(/[^a-zA-Z0-9_-]/g, "")}-${crypto.randomUUID()}`;
    container?.append(target);
    if (ready) {
      try {
        const api = (window as Window & { hbspt?: HubspotApi }).hbspt;
        if (!api) throw new Error("HubSpot forms API is unavailable");
        api.forms.create({
          portalId,
          formId,
          target: `#${target.id}`,
          formInstanceId: target.id,
          css: "",
          cssClass: "camp-hubspot-form",
          onFormReady: () => {
            if (!active) return;
            window.clearTimeout(timeout);
            setFailed(false);
          },
        });
      } catch {
        window.clearTimeout(timeout);
        // Keep error updates asynchronous with respect to this effect.
        queueMicrotask(() => { if (active) setFailed(true); });
      }
    }
    return () => {
      active = false;
      window.clearTimeout(timeout);
      target.remove();
    };
  }, [configured, formId, instanceId, portalId, ready]);

  return (
    <>
      {configured ? <Script
        id={`hubspot-script-${instanceId}`}
        src="https://js.hsforms.net/forms/embed/v2.js"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
        onError={() => setFailed(true)}
      /> : null}
      <div ref={host} className="hubspot-embed" />
      {failed || !configured ? (
        <p role="status">The form could not load. Please reload the page or contact the camp.</p>
      ) : null}
      <noscript>Please enable JavaScript to use this form, or contact the camp.</noscript>
    </>
  );
}
