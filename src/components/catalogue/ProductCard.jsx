import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="group flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary-bg border border-border">
          <Image
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            fittingType="fill"
          />
          {product.stock <= 8 && (
            <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-foreground">
              Low stock
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            {product.category}
          </p>
          <h3 className="font-heading text-xl leading-snug text-foreground">
            {product.title}
          </h3>
          <p className="text-[14px] text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-[15px] font-medium text-foreground">
          £{product.price.toFixed(0)}
        </span>
        <button
          onClick={() => addItem(product)}
          className="inline-flex min-h-[44px] items-center gap-2 px-2 text-[12px] uppercase tracking-[0.15em] text-foreground transition-colors duration-300 hover:text-muted-foreground"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}