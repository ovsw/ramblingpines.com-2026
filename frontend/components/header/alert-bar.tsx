"use client";

import { useSyncExternalStore } from "react";
import { PortableText } from "@portabletext/react";
import { X } from "lucide-react";
import { simpleRichTextComponents } from "@/components/simple-rich-text";
import type { HeaderModel } from "./model";

const storageKey = "rambling-pines-alert-dismissed";
const eventName = "rambling-pines-alert-change";
let dismissed = false;
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener("storage", callback);
  };
}
function snapshot() {
  try { return dismissed || sessionStorage.getItem(storageKey) === "yes"; }
  catch { return dismissed; }
}

export function AlertBar({ alert }: { alert: HeaderModel["alertBar"] }) {
  const hidden = useSyncExternalStore(subscribe, snapshot, () => false);
  if (!alert?.enabled || !alert.text?.length || hidden) return null;
  return <div className="shell-alert" role="region" aria-label="Camp announcement">
    <PortableText value={alert.text} components={simpleRichTextComponents} />
    <button aria-label="Close announcement" onClick={() => {
      dismissed = true;
      try { sessionStorage.setItem(storageKey, "yes"); } catch { /* Storage can be disabled. */ }
      window.dispatchEvent(new Event(eventName));
    }}><X aria-hidden="true" /><span>close</span></button>
  </div>;
}
