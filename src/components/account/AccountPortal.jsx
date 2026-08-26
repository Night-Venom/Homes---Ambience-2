const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';

export default function AccountPortal() {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setError("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password })
if (error) throw error
window.location.assign('/account')
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");


    
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: name },
  },
})

if (error) throw error
if (!data.session) throw new Error('Email confirmation is still enabled in Supabase.')

window.location.assign('/account')
  };

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-md px-5 md:px-6 py-20 md:py-32">
        <div className="text-center mb-12">
          <p className="text-[12px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
            The Portal
          </p>
          <h1 className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-foreground">
            Your account
          </h1>
        </div>

        <div className="border border-border bg-secondary-bg">
          <div className="grid grid-cols-2 border-b border-border">
            {[
              { key: "signin", label: "Sign In" },
              { key: "register", label: "Create Account" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => switchMode(t.key)}
                className={cn(
                  "min-h-[44px] py-4 text-[12px] uppercase tracking-[0.15em] transition-colors duration-300",
                  mode === t.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-10">
            {error && (
              <div className="mb-6 border border-border bg-background px-4 py-3 text-[13px] text-foreground">
                {error}
              </div>
            )}

            {mode === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-5">
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <Field label="Password" type="password" value={password} onChange={setPassword} />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[44px] bg-foreground text-background py-3.5 text-[13px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 hover:bg-accent-dark disabled:opacity-40"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="animate-spin" size={15} />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <Field label="Name" type="text" value={name} onChange={setName} />
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <Field label="Password" type="password" value={password} onChange={setPassword} />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[44px] bg-foreground text-background py-3.5 text-[13px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 hover:bg-accent-dark disabled:opacity-40"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="animate-spin" size={15} />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full min-h-[44px] border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors duration-300"
      />
    </label>
  );
}
