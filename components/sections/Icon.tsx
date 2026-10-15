/**
 * Line icons used by the section templates. Pick one by name in a content
 * file, for example `icon: car`. Drawn on a 24px grid with a 1.8px stroke.
 */
const paths: Record<string, React.ReactNode> = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  cross: <path d="M6 6l12 12M18 6L6 18" />,
  car: (
    <>
      <path d="M3 15v-3l2-5h14l2 5v3" />
      <path d="M3 15h18v3H3z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
      <path d="M5.5 12h13" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v10H2zM13 10h5l3 3v3h-8z" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  gavel: (
    <>
      <path d="M13.5 4.5l6 6M11 7l6 6M12.2 5.8l-4.4 4.4M18.2 11.8l-4.4 4.4" />
      <path d="M9.5 12.5L3 19" />
      <path d="M13 21h8" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  studio: (
    <>
      <path d="M3 9l9-5 9 5" />
      <path d="M5 8.5V20h14V8.5" />
      <path d="M8 12h3v3H8zM14 12h2.5v8H14" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M16 7l3 3M18 5l2 2" />
    </>
  ),
  book: (
    <>
      <path d="M4 5c3-1.5 5.5-1.5 8 0v15c-2.5-1.5-5-1.5-8 0z" />
      <path d="M20 5c-3-1.5-5.5-1.5-8 0v15c2.5-1.5 5-1.5 8 0z" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  phone: <path d="M6 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2L21 15v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  tools: (
    <>
      <path d="M14.5 6.5a3.5 3.5 0 0 0 4.6 4.6L21 13l-8 8-2-2 8-8" />
      <path d="M3 21l7.5-7.5M5.5 3.5L9 7l-2 2-3.5-3.5" />
    </>
  ),
  recycle: (
    <>
      <path d="M7.5 10L5 14.5h5M16.5 10L19 14.5h-5" />
      <path d="M9.5 6.5L12 3l2.5 3.5M5 14.5L8 20h8l3-5.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19C5 10 10 5 20 4c-.5 10-5.5 15-15 15z" />
      <path d="M5 19l8-8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3 19c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5M15 14c3 0 5.5 1.5 6 5" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  gift: (
    <>
      <path d="M4 10h16v4H4zM5.5 14H18.5v7h-13z" />
      <path d="M12 10v11M12 10c-2-4-6-4-6-1.5S10 10 12 10zM12 10c2-4 6-4 6-1.5S14 10 12 10z" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  map: (
    <>
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  download: (
    <>
      <path d="M12 4v11M7 10.5l5 5 5-5" />
      <path d="M4 19h16" />
    </>
  ),
};

export const iconNames = Object.keys(paths);

export default function Icon({ name, size = 24 }: { name?: string; size?: number }) {
  const p = name ? paths[name] : undefined;
  if (!p) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {p}
    </svg>
  );
}
