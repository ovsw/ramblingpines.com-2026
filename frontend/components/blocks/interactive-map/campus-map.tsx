"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PortableText } from "@portabletext/react";
import { stegaClean } from "next-sanity";
import type { Map as LeafletMap } from "leaflet";
import type { InteractiveMapBlock } from "../interactive-map";
import "leaflet/dist/leaflet.css";
import "./campus-map.css";

type Marker = NonNullable<InteractiveMapBlock["markers"]>[number];
type Props = Pick<InteractiveMapBlock, "campusImage" | "markers">;

export default function CampusMap({ campusImage, markers }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Marker | null>(null);
  const [photo, setPhoto] = useState(0);
  const url = campusImage?.asset?.url;

  // The full-bleed map fills the viewport below the header. The header's
  // height varies (alert bar, breakpoint), so measure it instead of guessing.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const element = frame.current;
    if (!header || !element) return;
    const apply = () =>
      element.style.setProperty("--site-header-height", `${header.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!url || !container.current) return;
    let cancelled = false;
    let map: LeafletMap | undefined;
    let observer: ResizeObserver | undefined;
    const element = container.current;

    import("leaflet").then((L) => {
      if (cancelled) return;
      // The imported markers use the old map's 1920 × 961 coordinate space.
      // Image replacements must keep that space, regardless of pixel resolution.
      const bounds = L.latLngBounds([0, 0], [961, 1920]);
      // Like the old site: wheel zoom, drag, and pinch stay at Leaflet's
      // defaults; there is no +/- control. The minimum zoom shows the whole
      // campus in the frame, but never below the old site's -0.5, so labels
      // stay readable on narrow screens and the visitor pans instead. The
      // maximum is about native image size.
      const leaflet = L.map(element, {
        crs: L.CRS.Simple,
        zoomSnap: 0.1,
        zoomControl: false,
        attributionControl: false,
        maxBounds: bounds.pad(0.2),
      });
      map = leaflet;
      const fitZoomRange = () => {
        // getBoundsZoom clamps to the current range, so widen it first.
        leaflet.setMinZoom(-8);
        leaflet.setMaxZoom(8);
        const fit = Math.max(leaflet.getBoundsZoom(bounds), -0.5);
        leaflet.setMinZoom(fit);
        leaflet.setMaxZoom(Math.max(0, fit));
        if (leaflet.getZoom() < fit) leaflet.fitBounds(bounds);
      };
      L.imageOverlay(url, bounds, { alt: stegaClean(campusImage?.alt) || "Camp map" })
        .on("load", () => { if (!cancelled) setReady(true); })
        .addTo(leaflet);
      fitZoomRange();
      leaflet.fitBounds(bounds);
      for (const item of markers ?? []) {
        if (typeof item.x !== "number" || typeof item.y !== "number") continue;
        const title = stegaClean(item.title) || "Camp location";
        const direction = stegaClean(item.labelDirection);
        const label = document.createElement("span");
        label.textContent = title;
        const marker = L.marker([item.y, item.x], {
          title,
          alt: title,
          icon: L.divIcon({ className: "camp-map-marker", iconSize: [16, 16] }),
          keyboard: true,
        }).addTo(map);
        marker.bindTooltip(label, {
          permanent: true,
          interactive: true,
          direction: direction === "left" || direction === "top" || direction === "bottom" ? direction : "right",
        });
        marker.on("click", () => {
          opener.current = marker.getElement() ?? null;
          setPhoto(0);
          setSelected(item);
        });
        marker.getElement()?.addEventListener("keydown", (event) => {
          if (event.key === " ") {
            event.preventDefault();
            marker.fire("click");
          }
        });
      }
      observer = new ResizeObserver(() => {
        leaflet.invalidateSize();
        fitZoomRange();
      });
      observer.observe(element);
    }).catch(() => {
      // Keep the static map available if the browser cannot load Leaflet.
      map?.remove();
      map = undefined;
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
      map?.remove();
    };
  }, [url, campusImage?.alt, markers]);

  const images = selected?.images?.filter((image) => image.asset?.url) ?? [];
  const current = images[photo];
  if (!url) return null;

  return (
    <>
      <div className="camp-map-frame" ref={frame}>
        {!ready && (
          // The unmodified image preserves the same coordinate space as the overlay.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="camp-map-fallback" src={url} alt={campusImage?.alt || "Camp map"} />
        )}
        <div ref={container} className="camp-map" aria-label="Interactive camp map" style={{ opacity: ready ? 1 : 0 }} />
      </div>
      <Dialog.Root open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-[101] max-h-[90dvh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-auto rounded bg-background p-6 shadow-xl"
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus(); }}
          >
            <Dialog.Title className="pr-20 text-3xl">{selected?.title}</Dialog.Title>
            <Dialog.Close className="absolute right-4 top-4 rounded border px-3 py-1">Close</Dialog.Close>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                {current?.asset?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={current.asset.url} alt={current.alt || selected?.title || "Camp location"} className="max-h-[60dvh] w-full object-contain" />
                )}
                {images.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-2" aria-label="Location photos">
                    {images.map((image, index) => (
                      <button key={image._key} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={index === photo} onClick={() => setPhoto(index)} className="rounded border-2 p-1 aria-pressed:border-primary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.asset!.url!} alt={image.alt || ""} className="h-16 w-20 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="prose max-w-none">{selected?.description && <PortableText value={selected.description} />}</div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
