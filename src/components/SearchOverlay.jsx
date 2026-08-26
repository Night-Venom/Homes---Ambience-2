supabase.from('products').select('*').eq('id', id).maybeSingle();

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Image } from "@/components/ui/image";
import { Search, X } from "lucide-react";
import { supabase } from '@/lib/supabase';

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    document.body.style.overflow = "";
    setQuery("");
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    db.entities.Product
      .list("-created_date", 100)
      .then((items) => active && setProducts(items))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const suggestions = q
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
        .slice(0, 6)
    : [];

  const go = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-background/96 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-5 md:px-12 pt-20 md:pt-28">
        <div className="flex items-center gap-4 border-b border-border pb-5">
          <Search size={22} strokeWidth={1.5} className="text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the collection..."
            className="flex-1 bg-transparent text-[18px] md:text-[22px] font-heading text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="min-touch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-6">
          {q === "" ? (
            <p className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
              Start typing to find a piece
            </p>
          ) : loading ? (
            <p className="text-[14px] text-muted-foreground">Loading...</p>
          ) : suggestions.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">
              No pieces match "{query}".
            </p>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => go(p.id)}
                    className="flex w-full items-center gap-4 px-2 py-4 text-left transition-colors duration-300 hover:bg-secondary-bg"
                  >
                    <div className="h-16 w-14 shrink-0 overflow-hidden bg-secondary-bg border border-border">
                      <Image
                        src={p.image_url}
                        alt={p.title}
                        className="h-full w-full object-cover"
                        fittingType="fill"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        {p.category}
                      </p>
                      <h3 className="font-heading text-lg text-foreground truncate">
                        {p.title}
                      </h3>
                    </div>
                    <span className="text-[14px] font-medium text-foreground">
                      £{p.price.toFixed(0)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
