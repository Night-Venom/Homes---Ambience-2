import React from "react";
import { useCart } from "@/lib/CartContext";
import { Image } from "@/components/ui/image";
import { X, Plus, Minus } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    subtotal,
    count,
    isCartOpen,
    closeCart,
    removeItem,
    updateQty,
    openCheckout,
  } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background border-l border-border flex flex-col transition-transform duration-500 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Your selection
            </p>
            <h2 className="font-heading text-2xl text-foreground mt-1">
              Cart <span className="text-muted-foreground">({count})</span>
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="min-touch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-heading text-2xl text-foreground">Your cart is empty</p>
              <p className="mt-3 text-[14px] text-muted-foreground max-w-[24ch]">
                Considered objects await. Return to the catalogue to begin.
              </p>
              <button
                onClick={closeCart}
                className="ghost-button mt-8"
              >
                Browse the catalogue
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-border pb-6">
                  <div className="h-24 w-20 shrink-0 overflow-hidden bg-secondary-bg border border-border">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      fittingType="fill"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          {item.category}
                        </p>
                        <h3 className="font-heading text-base text-foreground leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-[15px] font-medium text-foreground">
                        £{(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="min-touch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-[14px] text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          aria-label="Increase quantity"
                          className="min-touch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="min-h-[44px] text-[12px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
                Subtotal
              </span>
              <span className="font-heading text-2xl text-foreground">
                £{subtotal.toFixed(0)}
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground mb-5">
              FREE Shipping on all UK orders
            </p>
            <button
              onClick={openCheckout}
              className="w-full bg-foreground text-background py-4 text-[13px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 hover:bg-accent-dark"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
