/**
 * Hand-drawn marks laid over a printed photo as their own layer, like the
 * scribbles on KUC's printed material, instead of being baked into the image.
 * Pick one by name, or pass a seed (any string) to get a stable choice.
 */
const marks = {
  arrow: <path d="M6 54c10-4 22-16 24-30 1-8-6-10-9-4-4 9 10 14 20 6 6-5 9-12 10-20M48 2l4 5-6 3" />,
  star: (
    <>
      <path d="M32 6v16M32 42v16M6 32h16M42 32h16M14 14l10 10M40 40l10 10M50 14L40 24M24 40L14 50" />
    </>
  ),
  heart: <path d="M32 54C14 40 6 30 8 20c2-9 14-12 20-2 2 3 3 5 4 7 1-2 2-4 4-7 6-10 18-7 20 2 2 10-6 20-24 34z" />,
  sparkle: <path d="M10 22l6 8M30 6v12M50 16l-6 8M8 46c8 4 16 6 26 4" />,
  loop: <path d="M4 40c10 0 18-8 16-16-2-7-12-5-11 3 1 10 16 14 26 8s14-18 24-20" />,
};

export type DoodleName = keyof typeof marks;
const names = Object.keys(marks) as DoodleName[];

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export default function Doodle({ name, seed = "", corner = "tl", className }: { name?: DoodleName; seed?: string; corner?: "tl" | "tr" | "bl" | "br"; className?: string }) {
  const n = name ?? names[hash(seed) % names.length];
  return (
    <svg
      className={`doodle doodle-${corner} ${className ?? ""}`}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {marks[n]}
    </svg>
  );
}
