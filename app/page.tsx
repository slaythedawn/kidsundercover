import Hero from "@/components/Hero";
import ImpactIntro from "@/components/ImpactIntro";
import Programs from "@/components/Programs";
import Neighbourhood from "@/components/Neighbourhood";
import WaysToSupport from "@/components/WaysToSupport";
import Target450 from "@/components/Target450";
import Stories from "@/components/Stories";
import Explore from "@/components/Explore";

/**
 * The homepage, top to bottom, matching slide 23 of the deck, plus a
 * "Find your way" band that links the deeper pages people search for.
 * Reorder, remove or add sections here.
 */
export default function HomePage() {
  return (
    <>
        <Hero />
        <ImpactIntro />
        <Programs />
        <Neighbourhood />
        <WaysToSupport />
        <Target450 />
        <Stories />
        <Explore />
    </>
  );
}
