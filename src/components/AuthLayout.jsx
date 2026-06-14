import { Link } from "react-router-dom"

const STATS = [
  { value: "500+", label: "Restaurants" },
  { value: "7 days", label: "Free trial" },
  { value: "5 min", label: "To launch" },
]

export default function AuthLayout({ title, subtitle, children, brandingExtra }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left branding panel ── */}
      <div
        className="relative hidden w-5/12 flex-col overflow-hidden lg:flex"
        style={{ background: "linear-gradient(145deg, #13100d 0%, #1e1610 45%, #6b2410 100%)" }}
      >
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-float absolute -left-20 top-16 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="animate-float-slow absolute -right-16 bottom-24 h-80 w-80 rounded-full bg-brand-700/20 blur-3xl" />
          <div className="absolute inset-0 bg-menu-pattern opacity-[0.12]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 p-10 pb-0">
          <Link to="/" className="group inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-900/60 transition group-hover:bg-brand-400">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span className="font-display text-xl font-semibold text-white">E-Menu</span>
          </Link>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-10">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
            <span className="text-xs font-medium text-white/60">Digital menus, done beautifully</span>
          </div>

          <h2 className="font-display text-3xl font-semibold leading-snug text-white xl:text-4xl">
            Beautiful digital menus for cafes &amp; restaurants
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/45">
            Build, publish and share a stunning menu in minutes — free 7-day trial, no credit card needed.
          </p>

          {brandingExtra && <div className="mt-6">{brandingExtra}</div>}

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-semibold text-white">{s.value}</div>
                <div className="mt-0.5 text-xs text-white/35">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-10 pb-8">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} E-Menu · All rights reserved</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col bg-ink-50">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-ink-100 bg-white px-5 py-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-display text-base font-semibold text-ink-900">E-Menu</span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-xs text-ink-500 transition hover:text-ink-800">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Home
          </Link>
        </div>

        {/* Form scroll area */}
        <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-8 sm:items-center sm:py-12">
          <div className="w-full max-w-[420px]">
            <div className="rounded-2xl border border-ink-100/80 bg-white p-8 shadow-xl shadow-ink-900/[0.06]">
              <div className="mb-6 text-center">
                <h1 className="font-display text-2xl font-semibold text-ink-900">{title}</h1>
                {subtitle && (
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{subtitle}</p>
                )}
              </div>
              {children}
            </div>
            <p className="mt-4 text-center text-xs text-ink-400">
              © {new Date().getFullYear()} E-Menu · Powered by{" "}
              <a href="https://t.me/JustListenNow" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                Taye Animaw
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
