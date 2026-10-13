"use client";

import { useEffect, useRef, useState } from "react";
import { neighbourhood } from "@/content/home";
import { HouseFilled, PersonFilled, PersonTodo } from "./icons";
import s from "./Neighbourhood.module.css";

type Mode = (typeof neighbourhood.modes)[number];

export default function Neighbourhood() {
  const [mode, setMode] = useState<Mode>(neighbourhood.modes[0]);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number | null>(null);

  // Track the icon grid's height so the card grows and shrinks smoothly
  // between tabs instead of reserving empty space for the biggest one.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setGridHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  // Start the animation when the section scrolls into view.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Count up to the number for the selected tab.
  useEffect(() => {
    if (!started) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 0 : 1400;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = duration ? Math.min(1, (t - t0) / duration) : 1;
      setCount(Math.round(mode.value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, started]);

  const Filled = mode.icon === "house" ? HouseFilled : PersonFilled;
  const cells = [
    ...Array.from({ length: mode.filledIcons }, () => false),
    ...Array.from({ length: mode.todoIcons }, () => true),
  ];

  return (
    <section className="section" aria-labelledby="hood-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 id="hood-title" className={s.title}>{neighbourhood.title}</h2>
        <p className={s.lede}>{neighbourhood.lede}</p>

        <div className={s.tabs} role="tablist" aria-label="Choose what to show">
          {neighbourhood.modes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={m.id === mode.id}
              aria-controls="hood-panel"
              className={s.tab}
              onClick={() => setMode(m)}
            >
              {m.tab}
            </button>
          ))}
        </div>

        <div id="hood-panel" role="tabpanel" className={`sheet sheet-stack ${s.stage}`}>
          <div>
            <p className={s.count} aria-live="polite">
              {count.toLocaleString("en-AU")}
              {mode.plus && <small>+</small>}
            </p>
            <p className={s.caption}>{mode.caption}</p>
            <p className={s.key}>
              {mode.todoIcons > 0 ? <PersonTodo /> : <Filled />}
              <span>{mode.key}</span>
            </p>
          </div>

          <div className={s.gridWrap} style={gridHeight === null ? undefined : { height: gridHeight }}>
          <div ref={gridRef} className={s.grid} aria-hidden="true" data-started={started} key={mode.id}>
            {cells.map((todo, i) => (
              <div
                key={i}
                className={s.cell}
                data-todo={todo || undefined}
                style={{ animationDelay: `${(i * 14 + (todo ? 400 : 0)) / 1000}s` }}
              >
                {todo ? <PersonTodo /> : <Filled />}
              </div>
            ))}
          </div>
          </div>
        </div>

        <p className={s.note}>{neighbourhood.note}</p>
      </div>
    </section>
  );
}
