import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import InstallPwaPrompt from "../../components/InstallPwaPrompt"

// ─── Data ────────────────────────────────────────────────────────────────────

const PLANS = [
  { label: "1 Month",  price: 1000,  description: "30-day access" },
  { label: "3 Months", price: 2500,  description: "90-day access",  save: "Save 17%" },
  { label: "6 Months", price: 5000,  description: "180-day access", save: "Save 17%" },
  { label: "1 Year",   price: 10000, description: "365-day access", save: "Best value", highlight: true },
  { label: "Lifetime", price: 17000, description: "One-time, forever", dark: true },
]

const FEATURES = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
      </svg>
    ),
    title: "Built for mobile",
    desc: "Fast, lazy-loaded images and a layout customers love scrolling on their phones.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: "Stunning dish photos",
    desc: "Upload high-quality photos for every dish — visuals that sell.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    title: "Dietary tags",
    desc: "Highlight vegan, halal, gluten-free, keto and more — at a glance.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Instant live updates",
    desc: "Update prices, add items or pull dishes anytime — changes are live in seconds.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
      </svg>
    ),
    title: "QR code included",
    desc: "Print and stick your QR code on every table — customers scan and browse instantly.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Secure & always online",
    desc: "Your menu is hosted reliably — no downtime, no maintenance, no worry.",
  },
]

const STEPS = [
  {
    n: "01",
    title: "Sign up in 60 seconds",
    desc: "Create an account with your name and email. No credit card, no approval — just go.",
  },
  {
    n: "02",
    title: "Build your menu",
    desc: "Add categories, items, photos, prices and dietary tags from your simple dashboard.",
  },
  {
    n: "03",
    title: "Share with customers",
    desc: "Copy your link or print the QR code — customers see your menu on any device.",
  },
]

// ─── Mock menu card (visual demo in the hero) ────────────────────────────────

function MockMenuCard() {
  const items = [
    { name: "Injera Platter", price: "180", tag: "vegan", color: "from-green-400 to-emerald-500" },
    { name: "Tibs Special",   price: "320", tag: "halal", color: "from-brand-400 to-brand-500" },
    { name: "Kitfo",          price: "290", tag: "",      color: "from-red-300 to-red-400" },
    { name: "Tej (Honey Wine)",price: "150",tag: "",      color: "from-yellow-300 to-amber-400" },
  ]
  const cats = ["All", "Starters", "Mains", "Drinks"]

  return (
    <div className="relative mx-auto w-64 xl:w-72">
      {/* Glow ring */}
      <div className="absolute -inset-4 rounded-[2.5rem] bg-brand-500/10 blur-2xl" />

      {/* Phone shell */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-ink-900/30 ring-1 ring-white/20">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-ink-900 px-5 py-2">
          <span className="text-[10px] font-medium text-white/60">9:41</span>
          <div className="flex items-center gap-1">
            <div className="h-1 w-4 rounded-full bg-white/40" />
            <div className="h-1 w-3 rounded-full bg-white/40" />
            <div className="h-1 w-2 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Menu header */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-5">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-base">🍽️</div>
          <div className="font-display text-base font-semibold text-white">Habesha Bistro</div>
          <div className="text-[11px] text-white/65">Ethiopian Cuisine · Open now</div>
          <div className="mt-3 flex items-center gap-1.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="h-3 w-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[11px] text-white/70">4.9 (128)</span>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 overflow-x-hidden border-b border-ink-50 bg-white px-4 py-2.5">
          {cats.map((c, i) => (
            <span key={c} className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              i === 0 ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-500"
            }`}>{c}</span>
          ))}
        </div>

        {/* Items */}
        <div className="divide-y divide-ink-50 bg-white">
          {items.map((item) => (
            <div key={item.name} className="flex items-center gap-3 px-4 py-3">
              <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${item.color}`} />
              <div className="flex-1 min-w-0">
                <div className="truncate text-[12px] font-medium text-ink-900">{item.name}</div>
                {item.tag && (
                  <span className="mt-0.5 inline-block rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="shrink-0 text-[12px] font-semibold text-ink-800">
                {item.price}<span className="text-[10px] font-normal text-ink-400"> ETB</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center gap-1.5 bg-ink-50 px-4 py-3">
          <svg className="h-3.5 w-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          <span className="text-[10px] text-ink-400">menufront.ethioserve.com/menu/habesha</span>
        </div>
      </div>

      {/* Floating "live" badge */}
      <div className="absolute -right-3 -top-2 flex items-center gap-1.5 rounded-full bg-green-500 px-2.5 py-1 shadow-lg shadow-green-500/30">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        <span className="text-[10px] font-semibold text-white">Live</span>
      </div>

      {/* Floating scan badge */}
      <div className="absolute -left-4 bottom-16 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-xl shadow-ink-900/10 ring-1 ring-ink-100">
        <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        </svg>
        <div>
          <div className="text-[10px] font-semibold text-ink-900">Scan &amp; browse</div>
          <div className="text-[9px] text-ink-400">No app needed</div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LandingSearch() {
  const [subdomain, setSubdomain] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const clean = subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
    if (clean) navigate(`/menu/${clean}`)
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white text-ink-900">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-ink-100/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 shadow-sm shadow-brand-600/30">
              <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-display text-lg font-semibold text-ink-900">E-Menu</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-600 sm:flex">
            <a href="#features" className="transition hover:text-ink-900">Features</a>
            <a href="#how-it-works" className="transition hover:text-ink-900">How it works</a>
            <a href="#pricing" className="transition hover:text-ink-900">Pricing</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:scale-105 hover:from-brand-700 hover:to-brand-800"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-ink-50">
          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="animate-float absolute -left-32 -top-16 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
            <div className="animate-float-slow absolute -right-24 top-32 h-80 w-80 rounded-full bg-brand-300/20 blur-3xl" />
            <div className="animate-float absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-100/40 blur-3xl" />
            <div className="absolute inset-0 bg-menu-pattern-light opacity-60" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-700">
                  Digital menus, done beautifully
                </span>
              </div>

              <h1 className="font-display animate-fade-in-up mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-ink-900 [animation-delay:0.1s] sm:text-5xl xl:text-6xl">
                Your menu,{" "}
                <span className="text-gradient-brand">beautifully digital</span>
              </h1>

              <p className="animate-fade-in-up mt-5 max-w-xl text-base leading-relaxed text-ink-600 [animation-delay:0.2s] lg:text-lg">
                Showcase your dishes with photos, prices and dietary tags — formatted
                perfectly for phones. Start your free 7-day trial in minutes.
              </p>

              <div className="animate-fade-in-up mt-8 flex flex-col items-center gap-3 [animation-delay:0.3s] sm:flex-row lg:items-start">
                <Link
                  to="/register"
                  className="animate-pulse-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:scale-105 hover:from-brand-700 hover:to-brand-800"
                >
                  Start free trial
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-8 py-3.5 text-sm font-semibold text-ink-700 shadow-sm transition hover:scale-105 hover:bg-ink-50"
                >
                  See pricing
                </a>
              </div>

              <p className="animate-fade-in-up mt-3 text-xs text-ink-400 [animation-delay:0.4s]">
                No credit card required · Cancel anytime
              </p>

              {/* Search bar */}
              <form
                onSubmit={handleSubmit}
                className="animate-fade-in-up mt-10 flex w-full max-w-md flex-col gap-2 [animation-delay:0.5s] sm:flex-row lg:max-w-lg"
              >
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    placeholder="Find a cafe, e.g. habeshacafe"
                    className="w-full rounded-full border border-ink-200 bg-white py-3.5 pl-11 pr-4 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-ink-700"
                >
                  View menu
                </button>
              </form>
            </div>

            {/* Right: mock card */}
            <div className="animate-fade-in-up flex justify-center [animation-delay:0.35s] lg:justify-end">
              <MockMenuCard />
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-y border-ink-100 bg-white">
          <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-ink-100 px-5 sm:px-8">
            {[
              { value: "500+",  label: "Restaurants using E-Menu" },
              { value: "7 days", label: "Free trial, no card needed" },
              { value: "5 min",  label: "Average setup time" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 text-center">
                <span className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{s.value}</span>
                <span className="mt-1 text-xs text-ink-500 sm:text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="scroll-mt-20 bg-ink-50 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center">
              <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-700">
                Everything you need
              </span>
              <h2 className="font-display mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl">
                A complete digital menu solution
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
                Everything built-in — no plugins, no developers, no monthly surprises.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 transition group-hover:scale-110 group-hover:from-brand-100 group-hover:to-brand-200">
                    {f.icon}
                  </div>
                  <h3 className="font-display mt-4 text-base font-semibold text-ink-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="scroll-mt-20 bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center">
              <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-700">
                Simple as 1-2-3
              </span>
              <h2 className="font-display mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl">
                Up and running in minutes
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.n} className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-1/2 top-6 hidden h-0.5 w-full -translate-y-1/2 translate-x-[2.75rem] bg-ink-100 sm:block" />
                  )}
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-lg shadow-brand-600/25">
                    <span className="font-display text-sm font-bold text-white">{step.n}</span>
                  </div>
                  <h3 className="font-display mt-5 text-lg font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="scroll-mt-20 bg-ink-50 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center">
              <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-700">
                Pricing
              </span>
              <h2 className="font-display mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl">
                Simple, affordable plans
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-ink-500 sm:text-base">
                Start with a free 7-day trial, then pick what fits your business.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {PLANS.map((plan) => (
                <div
                  key={plan.label}
                  className={`group relative flex flex-col gap-1 overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 ${
                    plan.dark
                      ? "border-ink-800 bg-gradient-to-br from-ink-900 to-ink-800 text-white shadow-xl hover:shadow-2xl hover:shadow-ink-900/30"
                      : plan.highlight
                      ? "border-brand-300 bg-white shadow-lg shadow-brand-300/20 hover:shadow-xl hover:shadow-brand-300/30"
                      : "border-ink-100 bg-white shadow-sm hover:border-brand-200 hover:shadow-md"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute right-3 top-3 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                      {plan.save}
                    </span>
                  )}
                  {plan.save && !plan.highlight && (
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {plan.save}
                    </span>
                  )}
                  <span className={`font-display text-lg font-semibold ${plan.dark ? "text-white" : "text-ink-900"}`}>
                    {plan.label}
                  </span>
                  <span className={`text-2xl font-bold ${plan.dark ? "text-brand-300" : "text-brand-600"}`}>
                    {plan.price.toLocaleString()}
                    <span className="text-sm font-normal"> ETB</span>
                  </span>
                  <span className={`text-xs ${plan.dark ? "text-ink-300" : "text-ink-500"}`}>
                    {plan.description}
                  </span>

                  <Link
                    to="/register"
                    className={`mt-4 block rounded-xl py-2.5 text-center text-xs font-semibold transition ${
                      plan.dark
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : plan.highlight
                        ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow hover:from-brand-700 hover:to-brand-800"
                        : "bg-ink-100 text-ink-700 hover:bg-ink-200"
                    }`}
                  >
                    Start free trial
                  </Link>

                  <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition group-hover:opacity-100 ${
                    plan.dark ? "bg-brand-500/20" : "bg-brand-200/50"
                  }`} />
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-ink-400">
              All plans include a 7-day free trial · Payments processed securely via Chapa
            </p>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 py-20">
          <div className="animate-float pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="animate-float-slow pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 bg-menu-pattern opacity-20" />

          <div className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-8">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Ready to go digital?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-50 sm:text-base">
              Create your account, build your menu and start sharing it with customers
              in minutes — your first 7 days are completely free.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand-700 shadow-lg transition hover:scale-105 hover:bg-brand-50"
              >
                Create your free menu
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Log in to dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-ink-100 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="font-display text-base font-semibold text-ink-900">E-Menu</span>
              </Link>

              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-500">
                <a href="#features" className="hover:text-ink-900">Features</a>
                <a href="#how-it-works" className="hover:text-ink-900">How it works</a>
                <a href="#pricing" className="hover:text-ink-900">Pricing</a>
                <Link to="/login" className="hover:text-ink-900">Log in</Link>
                <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">Get started</Link>
              </nav>
            </div>
            <div className="mt-8 border-t border-ink-100 pt-6 text-center text-xs text-ink-400">
              © {new Date().getFullYear()} E-Menu · Powered by{" "}
              <a href="https://tayeanimaw.com" target="_blank" rel="noreferrer" className="font-semibold text-brand-600 hover:underline">
                Taye Animaw
              </a>
            </div>
          </div>
        </footer>

      </main>

      <InstallPwaPrompt />
    </div>
  )
}
