"use client";

import { useEffect, useRef, useState } from "react";
import { external } from "@/content/site";
import s from "./sections.module.css";

type DropIn = { create: (o: { donateFormURL: string; containerSelector: string }) => Promise<unknown> };

let loading: Promise<void> | undefined;
/** Loads KUC's drop-in script once per page. */
function loadDropIn() {
  loading ??= new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = external.npspDropIn;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => { loading = undefined; reject(new Error("drop-in failed")); };
    document.head.appendChild(el);
  });
  return loading;
}

/**
 * S23 Salesforce donation form. KUC's drop-in script adds the NPSP Plus form in a frame,
 * passes the page's campaign tags (utm_*) to Salesforce and sizes the frame to the form.
 * If the script can't load, people get a link to the same form instead.
 */
export default function NpspDonate({ form }: { form: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const id = `npsp-${form}`;
  useEffect(() => {
    let done = false;
    loadDropIn()
      .then(() => {
        const dropIn = (window as unknown as { npspPlusDropIn?: DropIn }).npspPlusDropIn;
        if (!dropIn || done || ref.current?.querySelector("iframe")) return;
        return dropIn.create({ donateFormURL: external.npspForm + form, containerSelector: `#${id}` });
      })
      .catch(() => setFailed(true));
    return () => { done = true; };
  }, [form, id]);
  return (
    <div id={id} ref={ref} className={s.npspFrame}>
      {failed && (
        <p className={s.npspFallback}>
          The donation form didn't load. <a href={external.npspForm + form}>Open the donation form</a>.
        </p>
      )}
    </div>
  );
}
