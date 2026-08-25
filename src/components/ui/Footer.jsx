import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-secondary-bg border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <h3 className="font-heading text-3xl text-foreground">
              Homes <span className="italic">& Ambience</span>
            </h3>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              A curated sanctuary for those who believe that a space is not
              decorated, but composed. Considered objects for a more intentional
              way of living.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <p className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
              Explore
            </p>
            <ul className="space-y-3 text-[14px] text-foreground">
              <li><Link to="/" className="hover:text-muted-foreground transition-colors">Home</Link></li>
              <li><Link to="/catalogue" className="hover:text-muted-foreground transition-colors">Catalogue</Link></li>
              <li><Link to="/account" className="hover:text-muted-foreground transition-colors">Account</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
              Studio
            </p>
            <ul className="space-y-3 text-[14px] text-foreground">
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Our Ethos</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
            © {new Date().getFullYear()} Homes & Ambience
          </p>
          <p className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
            Composed in stillness
          </p>
        </div>
      </div>
    </footer>
  );
}