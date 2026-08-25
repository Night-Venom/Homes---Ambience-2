import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";
import SearchOverlay from "@/components/SearchOverlay";
import MobileMenu from "@/components/MobileMenu";

const links = [
  { label: "Home", to: "/" },
  { label: "Catalogue", to: "/catalogue" },
  { label: "Account", to: "/account" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-20 border-b transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-md border-border"
            : "bg-background/60 backdrop-blur-sm border-border/60"
        )}
      >
        <nav className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 md:px-12">
          {/* Left: hamburger (mobile) / links (desktop) */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden min-touch -ml-2 flex items-center justify-center text-foreground"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <div className="hidden md:flex items-center gap-10">
              {links.slice(0, 2).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "nav-link",
                    pathname === l.to ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center logo */}
          <Link
            to="/"
            className="font-heading text-[20px] md:text-[24px] leading-none tracking-tight text-foreground absolute left-1/2 -translate-x-1/2"
          >
            Homes <span className="italic">& Ambience</span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3 md:gap-7">
            <Link
              to="/account"
              className={cn(
                "nav-link hidden md:inline",
                pathname === "/account" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Account
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="min-touch flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="min-touch relative flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium leading-none text-background">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}