import PageHero from "@/components/page/PageHero";
import CardGrid from "@/components/page/CardGrid";
import { links } from "@/content/site";

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="Page not found"
        title="We couldn't find that page."
        intro="It may have moved in our new website. These are the places most people are looking for."
        actions={[{ label: "Donate now", href: links.donate }, { label: "Go home", href: "/", variant: "ghost" }]}
      />
      <CardGrid
        cards={[
          { title: "Donate your car", href: links.donateYourCar, text: "Turn an old car into a room of their own." },
          { title: "Get support", href: links.getSupport, text: "Help for young people, families and carers." },
          { title: "Our programs", href: links.programs, text: "Studios, Village 21 and scholarships." },
          { title: "Stories", href: links.stories, text: "Young people, families and supporters." },
        ]}
      />
    </>
  );
}
