"use client";

import { useEffect } from "react";

/**
 * Pushes one dataLayer event when the page loads (set by `event` in a page's front matter).
 * Thank you pages use it so conversions are counted by event, not by page address.
 * Campaign tags on the address (utm_*) are passed along with the event.
 */
export default function TrackEvent({ name }: { name: string }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries([...params].filter(([k]) => k.startsWith("utm_")));
    const w = window as unknown as { dataLayer?: object[] };
    (w.dataLayer ??= []).push({ event: name, ...utm });
  }, [name]);
  return null;
}
