"use client";

import { useState } from "react";
import type { VideoSection } from "@/lib/sections";
import s from "./sections.module.css";

/**
 * S10 Video: a printed photo frame with a play button. The YouTube player
 * only loads when someone presses play, so the page stays fast.
 */
export default function Video({ youtube, label, poster, titleHtml, introHtml, bodyHtml, eyebrow }: Pick<VideoSection, "youtube" | "label" | "poster" | "eyebrow"> & {
  titleHtml?: string;
  introHtml?: string;
  bodyHtml?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = poster ?? `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`;
  return (
    <div className={s.video}>
      <div className={s.videoCopy}>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        {titleHtml && <h2 className={s.title} dangerouslySetInnerHTML={{ __html: titleHtml }} />}
        {introHtml && <p className={s.intro} dangerouslySetInnerHTML={{ __html: introHtml }} />}
        {bodyHtml && <div className={s.md} dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
      </div>
      <div className={`print ${s.videoFrame}`}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0`}
            title={label ?? "Video"}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className={s.videoPlay} onClick={() => setPlaying(true)} aria-label={`Play video: ${label ?? "video"}`}>
            <img src={thumb} alt="" loading="lazy" />
            <span className={s.playIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
            </span>
            {label && <span className={s.videoLabel}>{label}</span>}
          </button>
        )}
      </div>
    </div>
  );
}
