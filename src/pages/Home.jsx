
import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";

const HERO_IMG = "https://media.base44.com/images/public/6a8e0409a2eda96a390c67c0/da3ce5894_generated_3ec62abd.png";
const CAT_LINEN = "https://media.base44.com/images/public/6a8e0409a2eda96a390c67c0/8193a2730_generated_7dc04849.png";
const CAT_OAK = "https://media.base44.com/images/public/6a8e0409a2eda96a390c67c0/3f89df7f7_generated_85d4a8b0.png";
const CAT_STONE = "https://media.base44.com/images/public/6a8e0409a2eda96a390c67c0/a39a6f2d1_generated_c7659008.png";

const categories = [
  { title: "Textiles", subtitle: "Raw linen & soft weaves", img: CAT_LINEN, span: "md:col-span-5", ratio: "aspect-[3/4]" },
  { title: "Timber", subtitle: "The grain of oak", img: CAT_OAK, span: "md:col-span-4", ratio: "aspect-[4/5]" },
  { title: "Vessels", subtitle: "Stone & ceramic forms", img: CAT_STONE, span: "md:col-span-3", ratio: "aspect-[3/4]" },
];

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero — full bleed */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="A minimalist sun-drenched interior"
            className="h-full w-full object-cover"
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="mb-8 text-[12px] uppercase tracking-[0.3em] text-white/80">
            The Architecture of Atmosphere
          </p>
          <h1 className="font-heading text-[clamp(3rem,8vw,9rem)] leading-[0.95] text-white max-w-[14ch]">
            Create Your Atmosphere
          </h1>
          <Link to="/catalogue" className="ghost-button mt-12 !border-white !text-white hover:!bg-white hover:!text-foreground">
            Explore
          </Link>
        </div>
      </section>

      {/* Intro statement */}
      <section className="bg-background border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                01 — The Ethos
              </p>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-heading text-[clamp(2rem,4vw,3.75rem)] leading-[1.1] text-foreground">
                We curate objects that hold their quiet weight —
                <span className="italic text-muted-foreground"> composed for the way you live.</span>
              </h2>
              <p className="mt-10 max-w-xl text-[18px] leading-[1.6] text-muted-foreground">
                Each piece is chosen for its material honesty and its restraint.
                Nothing here shouts. Everything belongs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated passage — staggered collage */}
      <section className="bg-secondary-bg border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-20 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                02 — The Passage
              </p>
              <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-foreground">
                A curated passage
              </h2>
            </div>
            <Link
              to="/catalogue"
              className="group inline-flex items-center gap-3 text-[14px] uppercase tracking-[0.1em] text-foreground"
            >
              View the catalogue
              <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            {categories.map((c, i) => (
              <Link
                key={c.title}
                to="/catalogue"
                className={`group block ${c.span} ${i % 2 === 1 ? "md:mt-16" : ""}`}
              >
                <div className={`${c.ratio} overflow-hidden bg-background border border-border`}>
                  <Image
                    src={c.img}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    fittingType="fill"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between">
                  <h3 className="font-heading text-2xl text-foreground">{c.title}</h3>
                  <p className="text-[13px] uppercase tracking-[0.1em] text-muted-foreground">
                    {c.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="bg-background border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-40 text-center">
          <p className="text-[12px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
            The Invitation
          </p>
          <h2 className="font-heading text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] text-foreground max-w-[20ch] mx-auto">
            Begin with a single, considered object.
          </h2>
          <Link to="/catalogue" className="ghost-button mt-14">
            Explore the catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
