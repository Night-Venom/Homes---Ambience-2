const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/CartContext";
import { ArrowLeft } from "lucide-react";
import Recommendations from "@/components/catalogue/Recommendations";
import { supabase } from '@/lib/supabase';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    db.entities.Product.get(id)
      .then((p) => active && setProduct(p))
      .catch(() => active && setProduct(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background pt-20 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background pt-20 min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-heading text-3xl text-foreground">Piece not found</h1>
        <Link to="/catalogue" className="ghost-button mt-8">
          Return to catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background pt-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-12 md:py-16">
        <Link
          to="/catalogue"
          className="inline-flex min-h-[44px] items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 mb-10"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to catalogue
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="aspect-[4/5] overflow-hidden bg-secondary-bg border border-border">
            <Image
              src={product.image_url}
              alt={product.title}
              className="h-full w-full object-cover"
              fittingType="fill"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
              {product.category}
            </p>
            <h1 className="font-heading text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-foreground mt-3">
              {product.title}
            </h1>
            <p className="font-heading text-2xl text-foreground mt-6">
              £{product.price.toFixed(0)}
            </p>
            <p className="mt-8 text-[17px] leading-[1.7] text-muted-foreground max-w-md">
              {product.description}
            </p>
            <p className="mt-6 text-[13px] uppercase tracking-[0.12em] text-muted-foreground">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Currently unavailable"}
            </p>
            <button
              onClick={() => addItem(product)}
              disabled={product.stock <= 0}
              className="ghost-button mt-10 self-start disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <Recommendations product={product} />
    </div>
  );
}
