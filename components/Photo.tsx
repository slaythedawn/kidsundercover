import { media, type Img } from "@/lib/media";
import PhotoImg from "./PhotoImg";

type Props = { url?: string; img?: Img; alt?: string; className?: string; eager?: boolean };

/**
 * Every KUC image goes through this. Photos are cropped around their focal
 * point; graphics (logos, report covers, infographics) are shown whole.
 */
export default function Photo({ url, img, alt, className, eager }: Props) {
  const m = img ?? media(url);
  return m ? <PhotoImg img={m} alt={alt} className={className} eager={eager} /> : null;
}
