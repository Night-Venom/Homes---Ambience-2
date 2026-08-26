const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Image } from "@/components/ui/image";
import { Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';

export default function Recommendations({ product }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    db.functions
      .invoke("recommendProducts", { product_id: product.id })
      .then((res) => {
        if (active) setRecs(res.data?.recommendations || []);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [product.id]);

  return (
    <section className="bg-secondary-bg border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-20 md:py-28">
        <p className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Curated by Claude Opus 4.8
        </p>
        <h2 className="font-heading text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] text-foreground">
          Recommended for You
        </h2>

        {loading ? (
          <div className="mt-12 flex items-center gap-4">
            <Loader2
              className="animate-spin text-muted-foreground"
              size={24}
              strokeWidth={1.5}
            />
            <p className="text-[14px] uppercase tracking-[0.12em] text-muted-foreground">
              Loading Product Recommendations
            </p>
          </div>
        ) : recs.length === 0 ? (
          <p className="mt-12 text-[15px] text-muted-foreground">
            No recommendations available for this piece.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {recs.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-background border border-border">
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    fittingType="fill"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {p.category}
                    </p>
                    <h3 className="font-heading text-xl text-foreground">
                      {p.title}
                    </h3>
                  </div>
                  <span className="text-[15px] font-medium text-foreground">
                    £{p.price.toFixed(0)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
