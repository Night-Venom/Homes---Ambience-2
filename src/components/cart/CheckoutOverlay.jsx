import React, { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { X, Check, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
];

export default function CheckoutOverlay() {
  const { isCheckoutOpen, closeCheckout, items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
  });

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    closeCheckout();
    // reset after close animation
    setTimeout(() => {
      setStep(0);
      setSuccess(false);
    }, 300);
  };

  const handlePay = () => {
    // Placeholder: in future this will navigate to a Stripe checkout.
    setSuccess(true);
    clear();
  };

  const canProceedShipping =
    form.fullName && form.address1 && form.city && form.postcode;

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 md:px-12 py-10 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Checkout
            </p>
            <h1 className="font-heading text-3xl text-foreground mt-1">
              Complete your order
            </h1>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close checkout"
            className="min-touch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-12">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-[13px] transition-colors duration-300",
                    i <= step
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "text-[12px] uppercase tracking-[0.15em]",
                    i <= step ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px flex-1 bg-border" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl text-foreground">
              Shipping address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Full name"
                value={form.fullName}
                onChange={(v) => setForm({ ...form, fullName: v })}
                className="md:col-span-2"
              />
              <Field
                label="Address line 1"
                value={form.address1}
                onChange={(v) => setForm({ ...form, address1: v })}
                className="md:col-span-2"
              />
              <Field
                label="Address line 2 (optional)"
                value={form.address2}
                onChange={(v) => setForm({ ...form, address2: v })}
                className="md:col-span-2"
              />
              <Field
                label="City"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
              />
              <Field
                label="Postal code"
                value={form.postcode}
                onChange={(v) => setForm({ ...form, postcode: v })}
              />
              <Field
                label="Country"
                value={form.country}
                onChange={(v) => setForm({ ...form, country: v })}
                className="md:col-span-2"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                disabled={!canProceedShipping}
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-[13px] uppercase tracking-[0.15em] font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-dark"
              >
                Continue to payment
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl text-foreground">
                Stripe payment
              </h2>
              <p className="mt-3 text-[15px] text-muted-foreground max-w-md">
                You'll be redirected to Stripe's secure checkout to complete
                your payment. No card details are stored here.
              </p>
            </div>

            {/* Order summary */}
            <div className="border border-border">
              <div className="px-6 py-4 border-b border-border">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Order summary
                </p>
              </div>
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between px-6 py-4 text-[14px]">
                    <span className="text-foreground">
                      {item.title} <span className="text-muted-foreground">× {item.quantity}</span>
                    </span>
                    <span className="text-foreground">
                      £{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between px-6 py-4 border-t border-border">
                <span className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground">
                  Total
                </span>
                <span className="font-heading text-2xl text-foreground">
                  £{subtotal.toFixed(0)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(0)}
                className="inline-flex min-h-[44px] items-center gap-2 text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
                Back
              </button>
              <button
                onClick={handlePay}
                disabled={items.length === 0}
                className="inline-flex items-center gap-2 bg-foreground text-background px-10 py-4 text-[13px] uppercase tracking-[0.15em] font-medium transition-all duration-300 disabled:opacity-40 hover:bg-accent-dark"
              >
                <Lock size={15} strokeWidth={1.5} />
                Pay Securely
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success modal */}
      {success && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md border border-border bg-background p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
              <Check size={26} strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-3xl text-foreground mt-6">
              Order confirmed
            </h3>
            <p className="mt-3 text-[15px] text-muted-foreground">
              Thank you. Your considered selection is on its way.
            </p>
            <button
              onClick={handleClose}
              className="ghost-button mt-8"
            >
              Return to the catalogue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, className }) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[44px] border border-border bg-transparent px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors duration-300"
      />
    </label>
  );
}