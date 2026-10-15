"use client";

import { usePathname } from "next/navigation";
import { hero, links } from "@/content/home";
import s from "./MobileDonateBar.module.css";

/**
 * Frosted donate bar that stays on screen on phones. Hidden on desktop.
 * On car pages it asks for the car instead of money, to match why people came.
 */
export default function MobileDonateBar() {
  const path = usePathname() ?? "";
  const car = path.startsWith("/get-involved/donate-your-car");
  return (
    <div className={s.bar}>
      <span>{car ? "100% tax deductible" : hero.donatePrompt}</span>
      <a className="btn btn-sun" href={car ? links.carForm : links.donate}>{car ? "Donate your car" : "Donate"}</a>
    </div>
  );
}
