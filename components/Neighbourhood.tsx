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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ width: number; desktop: boolean } | null>(null);

  // Measure the space the icons sit in, so the layout below can keep the
  // card the same height on every tab.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 900px)");
    const measure = () => setBox({ width: el.clientWidth, desktop: mq.matches });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, []);

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

  const layout = box ? fitGrid(box.width, box.desktop, mode.filledIcons + mode.todoIcons) : null;

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
            {/* All captions share one spot, so the space always fits the longest one. */}
            <div className={s.captions}>
              {neighbourhood.modes.map((m) => (
                <p key={m.id} className={s.caption} aria-hidden={m.id !== mode.id} data-active={m.id === mode.id}>
                  {m.caption}
                </p>
              ))}
            </div>
            <p className={s.key}>
              {mode.todoIcons > 0 ? <PersonTodo /> : <Filled />}
              <span>{mode.key}</span>
            </p>
          </div>

          <div ref={wrapRef} className={s.gridWrap} style={layout ? { height: layout.height } : undefined}>
          <div
            ref={gridRef}
            className={s.grid}
            aria-hidden="true"
            data-started={started}
            key={mode.id}
            style={layout ? { gridTemplateColumns: `repeat(${layout.columns}, 1fr)`, width: layout.gridWidth } : undefined}
          >
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

/**
 * Every tab gets the same box: the full width, and the height the busiest tab
 * needs at the standard column count. Tabs with fewer icons use fewer, larger
 * icons, still spanning the full width, so the box edges never move between tabs.
 */
const STANDARD_COLUMNS = { desktop: 14, mobile: 10 };
const GAP = { desktop: 8, mobile: 6 };

function fitGrid(width: number, desktop: boolean, count: number) {
  const gap = desktop ? GAP.desktop : GAP.mobile;
  const standard = desktop ? STANDARD_COLUMNS.desktop : STANDARD_COLUMNS.mobile;
  const busiest = Math.max(...neighbourhood.modes.map((m) => m.filledIcons + m.todoIcons));

  const size = (cols: number) => (width - (cols - 1) * gap) / cols;
  const heightFor = (cols: number, n: number) => {
    const rows = Math.ceil(n / cols);
    return rows * size(cols) + (rows - 1) * gap;
  };

  const height = heightFor(standard, busiest);
  let columns = standard;
  for (let c = 1; c <= standard; c++) {
    if (heightFor(c, count) <= height) {
      columns = c;
      break;
    }
  }
  return { height: Math.ceil(height), columns, gridWidth: width };
}
