import { links } from "@/content/site";
import { WayIcon } from "../icons";
import s from "./GiveOptions.module.css";

const options = [
  { icon: "heart", title: "Donate now", text: "A one off gift of any size, given online in minutes.", href: links.donate, cta: "Donate now", lead: true },
  { icon: "heart", title: "Give monthly", text: "Regular gifts help us plan more studios each year.", href: links.monthly, cta: "Give monthly" },
  { icon: "car", title: "Donate your car", text: "We collect it, sell it and fund studios with the proceeds.", href: links.donateYourCar, cta: "Donate your car" },
  { icon: "will", title: "Gift in your will", text: "Leave a legacy that keeps young people close to home.", href: links.giftsInWills, cta: "Find out more" },
  { icon: "piggy", title: "Fundraise", text: "Run, ride, climb or host an event for young people.", href: links.fundraise, cta: "Start fundraising" },
  { icon: "handshake", title: "Partner with us", text: "Workplace giving, sponsorship and building partnerships.", href: links.partnerships, cta: "Partner with us" },
] as const;

/** The ways to give, side by side, at the top of the giving hub. */
export default function GiveOptions() {
  return (
    <section className="section" style={{ paddingTop: 0 }} aria-label="Ways to give">
      <div className="wrap">
        <ul className={s.grid}>
          {options.map((o) => (
            <li key={o.title}>
              <a href={o.href} className={`sheet ${s.card}`} data-lead={"lead" in o ? true : undefined}>
                <span className={`ring ${s.icon}`}><WayIcon name={o.icon} /></span>
                <h2 className={s.title}>{o.title}</h2>
                <p className={s.text}>{o.text}</p>
                <span className={`btn ${"lead" in o ? "btn-ink" : "btn-ghost"} ${s.btn}`}>{o.cta}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
