import { hero, links } from "@/content/home";
import s from "./MobileDonateBar.module.css";

/** Frosted donate bar that stays on screen on phones. Hidden on desktop. */
export default function MobileDonateBar() {
  return (
    <div className={s.bar}>
      <span>{hero.donatePrompt}</span>
      <a className="btn btn-sun" href={links.donate}>Donate</a>
    </div>
  );
}
