import type { Img } from "@/lib/media";

/** The image element itself, safe to use in client components. Use <Photo> on the server. */
export default function PhotoImg({ img, alt = "", className, eager }: { img: Img; alt?: string; className?: string; eager?: boolean }) {
  const pos = img.fx != null ? `${Math.round(img.fx * 100)}% ${Math.round((img.fy ?? 0.42) * 100)}%` : "50% 40%";
  return (
    <img
      src={img.src}
      alt={alt}
      className={className}
      data-kind={img.kind}
      width={img.w}
      height={img.h}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={img.kind === "photo" ? { objectPosition: pos } : undefined}
    />
  );
}
