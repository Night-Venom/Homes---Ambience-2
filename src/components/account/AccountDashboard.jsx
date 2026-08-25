const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function AccountDashboard({ user }) {
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    db.entities.Order.list("-created_date", 20)
      .then((o) => active && setOrders(o))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const memberSince = user.created_date
    ? new Date(user.created_date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
      })
    : "—";

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-20 md:py-28">
        <p className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Your dashboard
        </p>
        <h1 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-foreground">
          Welcome back
        </h1>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Account details */}
          <div className="md:col-span-5">
            <div className="border border-border">
              <div className="border-b border-border px-6 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Account details
                </p>
              </div>
              <dl className="divide-y divide-border">
                <Row label="Name" value={user.full_name || "—"} />
                <Row label="Email" value={user.email} />
                <Row label="Role" value={user.role || "user"} />
                <Row label="Member since" value={memberSince} />
              </dl>
            </div>
            <button
              onClick={() => logout()}
              className="ghost-button mt-8"
            >
              Sign out
            </button>
          </div>

          {/* Order history */}
          <div className="md:col-span-7">
            <div className="border border-border">
              <div className="border-b border-border px-6 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Order history
                </p>
              </div>
              {loading ? (
                <div className="px-6 py-16 flex items-center gap-3 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" />
                  <span className="text-[14px]">Loading orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="font-heading text-xl text-foreground">No orders yet</p>
                  <p className="mt-2 text-[14px] text-muted-foreground">
                    Your considered purchases will appear here.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {orders.map((o) => (
                    <li key={o.id} className="px-6 py-5 flex items-center justify-between">
                      <div>
                        <p className="text-[14px] text-foreground">
                          Order · {o.items?.length || 0} items
                        </p>
                        <p className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground mt-1">
                          {new Date(o.created_date).toLocaleDateString("en-GB")} · {o.status}
                        </p>
                      </div>
                      <span className="font-heading text-xl text-foreground">
                        £{Number(o.total).toFixed(0)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <dt className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-[14px] text-foreground text-right">{value}</dd>
    </div>
  );
}