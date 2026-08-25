const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useMemo, useEffect } from "react";

import { Image } from "@/components/ui/image";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/catalogue/ProductCard";

const FILTERS = ["All", "Home", "Tech", "Lighting", "Objects"];

const SORTS = [
  { key: "bestselling", label: "Bestselling" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "alpha", label: "Alphabetical" },
];

const HERO_IMG = "/__generating__/a9b5e70e-1b31-4024-a423-aefbbc3416c7.png";

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortKey, setSortKey] = useState("bestselling");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    db.entities.Product.list("-created_date", 100)
      .then((items) => {
        if (mounted) {
          setProducts(items);
          setLoading(false);
        }
      })
      .catch(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const visible = useMemo(() => {
    let list = [...products];
    if (activeFilter !== "All") {
      list = list.filter((p) => p.category === activeFilter);
    }
    switch (sortKey) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "alpha":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        list.sort(
          (a, b) => (a.bestselling_rank ?? 0) - (b.bestselling_rank ?? 0)
        );
    }
    return list;
  }, [products, activeFilter, sortKey]);

  const activeSortLabel = SORTS.find((s) => s.key === sortKey)?.label;

  return (
    <div className="bg-background pt-20">
      {/* Catalogue header */}
      <section className="border-b border-border">
        <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
          <Image
            src={HERO_IMG}
            alt="The catalogue"
            className="h-full w-full object-cover"
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-[12px] uppercase tracking-[0.3em] text-white/80 mb-5">
              The Catalogue
            </p>
            <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] text-white">
              A considered collection
            </h1>
          </div>
        </div>
      </section>

      {/* Filter + sort bar */}
      <section className="sticky top-20 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "min-h-[44px] whitespace-nowrap rounded-full border px-5 py-2.5 text-[12px] uppercase tracking-[0.12em] transition-all duration-300",
                    activeFilter === f
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-foreground/50"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="inline-flex min-h-[44px] items-center gap-2 border border-border bg-transparent px-5 py-2.5 text-[12px] uppercase tracking-[0.12em] text-foreground transition-colors duration-300 hover:border-foreground/50"
              >
                <SlidersHorizontal size={14} strokeWidth={1.5} />
                Sort: {activeSortLabel}
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  className={cn("transition-transform duration-300", sortOpen && "rotate-180")}
                />
              </button>
              {sortOpen && (
                <div className="absolute right-0 mt-2 w-60 border border-border bg-background shadow-lg z-40">
                  {SORTS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        setSortKey(s.key);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "block w-full px-5 py-3 text-left text-[13px] transition-colors duration-200",
                        sortKey === s.key
                          ? "bg-secondary-bg text-foreground"
                          : "text-muted-foreground hover:bg-secondary-bg hover:text-foreground"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-16 md:py-24">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-y-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-secondary-bg border border-border" />
                  <div className="mt-5 h-3 w-1/3 bg-secondary-bg" />
                  <div className="mt-3 h-4 w-2/3 bg-secondary-bg" />
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p className="py-24 text-center text-[15px] text-muted-foreground">
              No pieces in this category yet.
            </p>
          ) : (
            <>
              <p className="mb-10 text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
                {visible.length} {visible.length === 1 ? "piece" : "pieces"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-y-12">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}