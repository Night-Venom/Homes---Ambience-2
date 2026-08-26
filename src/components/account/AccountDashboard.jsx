import React from 'react'
import { useAuth } from '@/lib/AuthContext'

export default function AccountDashboard({ user }) {
  const { logout } = useAuth()

  const name = user.full_name || user.user_metadata?.full_name || '—'
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
      })
    : '—'

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-6 md:px-12 py-20 md:py-28">
        <p className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Your account
        </p>
        <h1 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-foreground">
          Welcome back, {name}
        </h1>

        <div className="mt-16 border border-border">
          <dl className="divide-y divide-border">
            <Row label="Name" value={name} />
            <Row label="Email" value={user.email || '—'} />
            <Row label="Member since" value={memberSince} />
          </dl>
        </div>

        <button onClick={logout} className="ghost-button mt-8">
          Sign out
        </button>
      </div>
    </section>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4">
      <dt className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-[14px] text-foreground text-right">{value}</dd>
    </div>
  )
}
