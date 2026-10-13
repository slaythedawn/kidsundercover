/** Icons and hand drawn illustrations used on the homepage. */

type P = React.SVGProps<SVGSVGElement>;

export const Sparkle = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5v.9c-4.6.6-6.9 2.9-7.5 7.5h-.9c-.6-4.6-2.9-6.9-7.5-7.5V10c4.6-.6 6.9-2.9 7.5-7.5z" fill="currentColor" transform="translate(.5 1.5)" />
  </svg>
);

export const Arrow = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

/* ---------- Neighbourhood icons ---------- */
export const HouseFilled = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M3 11.5 12 4l9 7.5V20H3z" fill="#FFD520" stroke="#1F1D19" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M10 20v-5h4v5" fill="#1F1D19" />
  </svg>
);

export const PersonFilled = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <circle cx="12" cy="7.5" r="4" fill="#1F1D19" />
    <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" fill="#FFD520" stroke="#1F1D19" strokeWidth="1.6" />
  </svg>
);

export const PersonTodo = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#1F1D19" strokeWidth="1.8" strokeDasharray="2.5 2.5" aria-hidden="true" {...p}>
    <circle cx="12" cy="7.5" r="4" />
    <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" />
  </svg>
);

/* ---------- Ways to support icons (line art on a yellow disc) ---------- */
const line = { fill: "none", stroke: "#1F1D19", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const WayIcon = ({ name }: { name: "heart" | "car" | "will" | "handshake" | "piggy" }) => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    {name === "heart" && (
      <path {...line} d="M24 36s-12-7.2-12-15.2A6.8 6.8 0 0 1 24 17a6.8 6.8 0 0 1 12 3.8C36 28.8 24 36 24 36z" />
    )}
    {name === "car" && (
      <g {...line}>
        <path d="M10 29v-4l3.5-7h21l3.5 7v4z" />
        <path d="M15 18.5 17 23h14l2-4.5" />
        <circle cx="16.5" cy="30.5" r="2.8" fill="#FFD520" />
        <circle cx="31.5" cy="30.5" r="2.8" fill="#FFD520" />
      </g>
    )}
    {name === "will" && (
      <g {...line}>
        <path d="M15 12h14l5 5v19H15z" />
        <path d="M19 20h10M19 25h10M19 30h5" />
        <path d="M31 32l6-9 2 1.4-6 9-2.6 1.2z" />
      </g>
    )}
    {name === "handshake" && (
      <g {...line}>
        <path d="M8 22l6-5 6 2 4-2 6 1 8 4" />
        <path d="M14 17l-4 9 8 7c1.3 1 2.8.6 3.4-.6M20 26l5 5c1 1 2.6.8 3.2-.4M23 22l6 6c1 1 2.6.6 3-.6M30 18l-6 5c-1.4 1-3.2.6-3.6-1" />
        <path d="M38 22l-3 8" />
      </g>
    )}
    {name === "piggy" && (
      <g {...line}>
        <path d="M13 26c0-5.5 5-9 11.5-9S36 20.5 36 26c0 3-1.5 5.3-4 6.8V36h-4v-2h-6v2h-4v-3.6C15 31 13 28.8 13 26z" />
        <path d="M36 24h2.5v4H36M20 17.8l-1.5-3.5 4 1.4" />
        <path d="M22 13.5h5" />
        <circle cx="30.5" cy="11" r="3.2" fill="#FFD520" />
      </g>
    )}
  </svg>
);

/* ---------- Hand made illustration: home, studio and the path between ---------- */
export const HomeAndStudio = (p: P) => (
  <svg viewBox="0 0 420 300" aria-hidden="true" {...p}>
    <defs>
      <filter id="rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="3" />
      </filter>
    </defs>
    {/* ground */}
    <ellipse cx="215" cy="248" rx="190" ry="34" fill="#E9E3D6" />
    {/* sun */}
    <circle cx="330" cy="58" r="30" fill="#FFD520" />
    <path d="M300 54a30 30 0 0 1 55-17" fill="none" stroke="#1F1D19" strokeWidth="2" strokeLinecap="round" filter="url(#rough)" />
    <g filter="url(#rough)">
      {/* family home */}
      <path d="M40 122 108 72l68 50v104H40z" fill="#1F1D19" />
      <path d="M32 126 108 68l76 58" fill="none" stroke="#1F1D19" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="138" y="70" width="14" height="28" fill="#1F1D19" />
      <rect x="62" y="140" width="22" height="20" fill="#5A564D" />
      <rect x="132" y="140" width="22" height="20" fill="#5A564D" />
      <path d="M90 226v-48h36v48z" fill="#F6F3EC" />
      {/* studio */}
      <path d="M268 170h88v62h-88z" fill="#FDFCF9" stroke="#1F1D19" strokeWidth="3" />
      <path d="M260 172l50-26 54 24" fill="none" stroke="#1F1D19" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="282" y="186" width="24" height="22" fill="#FFD520" stroke="#1F1D19" strokeWidth="2.5" />
      <path d="M294 186v22M282 197h24" stroke="#1F1D19" strokeWidth="2" />
      <rect x="322" y="192" width="18" height="40" fill="#1F1D19" />
    </g>
    {/* path between */}
    <path d="M128 232c40 6 60-18 100-10s46 14 46 14" fill="none" stroke="#1F1D19" strokeWidth="2.4" strokeDasharray="7 7" strokeLinecap="round" />
    <circle cx="244" cy="262" r="4" fill="#1F1D19" />
    <circle cx="258" cy="266" r="2.6" fill="#1F1D19" />
    {/* grass */}
    <g fill="none" stroke="#8B8577" strokeWidth="1.6" strokeLinecap="round">
      <path d="M220 200c4-10 2-20-4-26M220 200c-2-6-8-10-14-10M218 186c4-4 10-4 14-2" />
      <path d="M372 222c2-8 0-14-4-18M372 222c4-4 10-4 12-2" />
    </g>
  </svg>
);

/* ---------- Target450 artwork, shown as a print ---------- */
export const Target450Art = (p: P) => (
  <svg viewBox="0 0 300 300" aria-hidden="true" {...p}>
    <rect width="300" height="300" fill="#FFD520" />
    <g fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" opacity="0.9">
      {[
        [30, 40], [90, 24], [160, 36], [230, 22], [262, 70], [24, 110], [250, 140],
        [40, 200], [110, 250], [190, 246], [252, 214], [70, 150], [210, 96], [130, 70],
      ].map(([x, y], i) => (
        <path key={i} transform={`translate(${x} ${y}) scale(${0.8 + (i % 3) * 0.25})`} d="M0 12 10 3l10 9v12H0z M7 24v-6h6v6" />
      ))}
    </g>
    <g transform="rotate(-4 150 150)">
      <text x="150" y="138" textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight="800" fontSize="52" fill="#fff" stroke="#1F1D19" strokeWidth="14" strokeLinejoin="round" paintOrder="stroke">TARGET</text>
      <text x="150" y="220" textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight="800" fontSize="96" fill="#fff" stroke="#1F1D19" strokeWidth="16" strokeLinejoin="round" paintOrder="stroke">450</text>
    </g>
  </svg>
);

/* ---------- Drawn car, used where a story has no photo yet ---------- */
export const CarDrawing = (p: P) => (
  <svg viewBox="0 0 160 120" aria-hidden="true" {...p}>
    <rect width="160" height="120" fill="#CFE3F2" />
    <path d="M18 92c20-6 104-6 124 0" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    <g fill="none" stroke="#1F1D19" strokeWidth="2.6" strokeLinejoin="round">
      <path d="M30 78v-12l12-18h54l20 18h14v12z" fill="#fff" />
      <path d="M48 50l-8 16h34V50zM80 50v16h28L92 50z" fill="#CFE3F2" />
      <circle cx="52" cy="80" r="9" fill="#FFD520" />
      <circle cx="110" cy="80" r="9" fill="#FFD520" />
    </g>
    <path d="M118 30c6-8 18-8 22 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
  </svg>
);
