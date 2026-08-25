import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/" },
  { label: "Catalogue", to: "/catalogue" },
  { label: "Account", to: "/account" },
];

export default function MobileMenu({ open, onClose }) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      <aside
        className={cn(
          "fixed top-0 left-0 z-[60] h-full w-[82%] max-w-sm bg-background border-r border-border flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 h-20">
          <span className="font-heading text-xl text-foreground">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="min-touch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-col">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              className={cn(
                "min-h-[56px] flex items-center border-b border-border px-6 font-heading text-2xl transition-colors duration-300 hover:bg-secondary-bg",
                pathname === l.to ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}