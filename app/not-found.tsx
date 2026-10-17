import PageHero from "@/components/page/PageHero";
import CardGrid from "@/components/page/CardGrid";
import { links } from "@/content/site";

export default function NotFound() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Page not found", href: "/404/" }]}
        eyebrow="Page not found"
        title="We couldn't find that page."
        intro="It may have moved in our new website. These are the places most people are looking for."
        actions={[{ label: "Donate now", href: links.donate }, { label: "Go home", href: "/", variant: "ghost" }]}
      />
      <CardGrid
        cards={[
          { title: "Donate your car", href: links.donateYourCar, text: "Turn an old car into a room of their own.", image: "https://www.kuc.org.au/wp-content/uploads/2024/02/studio-program-apply-montage.jpg" },
          { title: "Get support", href: links.getSupport, text: "Help for young people, families and carers.", image: "https://www.kuc.org.au/wp-content/uploads/2024/02/about-montage-3.jpg" },
          { title: "Our programs", href: links.programs, text: "Studios, Village 21 and scholarships.", image: "https://www.kuc.org.au/wp-content/uploads/2024/02/village-program-montage-1.jpg" },
          { title: "Stories", href: links.stories, text: "Young people, families and supporters.", image: "/images/studios.jpg" },
        ]}
      />
    </>
  );
}
