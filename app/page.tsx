import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImpactIntro from "@/components/ImpactIntro";
import Programs from "@/components/Programs";
import Neighbourhood from "@/components/Neighbourhood";
import WaysToSupport from "@/components/WaysToSupport";
import Target450 from "@/components/Target450";
import Stories from "@/components/Stories";
import Footer from "@/components/Footer";
import MobileDonateBar from "@/components/MobileDonateBar";

/**
 * The homepage, top to bottom, matching slide 23 of the deck.
 * Reorder, remove or add sections here.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <ImpactIntro />
        <Programs />
        <Neighbourhood />
        <WaysToSupport />
        <Target450 />
        <Stories />
      </main>
      <Footer />
      <MobileDonateBar />
    </>
  );
}
