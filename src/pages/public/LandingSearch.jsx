import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SiteFooter from "../../components/SiteFooter";
import InstallPwaPrompt from "../../components/InstallPwaPrompt";

const PLANS = [
  { label: "1 Month", price: 1000, description: "Billed once, 30 days" },
  { label: "3 Months", price: 2500, description: "Billed once, 90 days" },
  { label: "6 Months", price: 5000, description: "Billed once, 180 days" },
  {
    label: "1 Year",
    price: 10000,
    description: "Billed once, 365 days",
    highlight: "Best value",
  },
  {
    label: "Lifetime",
    price: 17000,
    description: "One-time, never expires",
    dark: true,
  },
];

export default function LandingSearch() {
  const [subdomain, setSubdomain] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = subdomain
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    if (clean) {
      navigate(`/menu/${clean}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white text-ink-900">
      <header className="relative z-10 flex items-center justify-between border-b border-ink-100 bg-white/80 px-6 py-5 backdrop-blur-sm sm:px-10">
        <span className="font-display text-2xl font-semibold tracking-tight text-ink-900">
          E-Menu
        </span>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-ink-700 transition hover:bg-ink-100"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-2 font-semibold text-white shadow-md shadow-brand-600/25 transition hover:scale-105 hover:from-brand-700 hover:to-brand-800"
          >
            Get started free
          </Link>
        </nav>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-6 py-16 text-center">
        {/* Decorative animated background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-float absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="animate-float-slow absolute -right-20 top-40 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl" />
          <div className="animate-float-slow absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-ink-200/30 blur-3xl" />
        </div>

        <span className="animate-fade-in-up rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Digital menus, done beautifully
        </span>
        <h1 className="font-display animate-fade-in-up mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink-900 [animation-delay:0.1s] sm:text-6xl">
          Turn your menu into a beautiful, sales-driving experience
        </h1>
        <p className="animate-fade-in-up mt-5 max-w-xl text-base text-ink-600 [animation-delay:0.2s] sm:text-lg">
          Showcase your dishes with stunning photos, prices and dietary info —
          perfectly formatted for phones, tablets and desktops. Start your free
          7-day trial in minutes, no approval needed.
        </p>

        <div className="animate-fade-in-up mt-8 flex flex-col gap-3 [animation-delay:0.3s] sm:flex-row">
          <Link
            to="/register"
            className="animate-pulse-glow rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:scale-105 hover:from-brand-700 hover:to-brand-800"
          >
            Start free 7-day trial
          </Link>
          <a
            href="#pricing"
            className="rounded-full border border-ink-200 bg-white px-8 py-3.5 text-sm font-semibold text-ink-700 shadow transition hover:scale-105 hover:bg-ink-50"
          >
            See pricing
          </a>
        </div>
        <p className="animate-fade-in-up mt-3 text-xs text-ink-500 [animation-delay:0.4s]">
          No credit card required to get started.
        </p>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-in-up mt-10 flex w-full max-w-lg flex-col gap-3 [animation-delay:0.5s] sm:flex-row"
        >
          <input
            type="text"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            placeholder="Enter a cafe's link, e.g. mycafe"
            className="w-full min-w-0 flex-1 rounded-full border border-ink-200 bg-ink-50 px-5 py-3.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button
            type="submit"
            className="shrink-0 whitespace-nowrap rounded-full bg-gradient-to-br from-ink-900 to-ink-800 px-8 py-3.5 text-sm font-semibold text-white shadow transition hover:scale-105 hover:from-ink-800 hover:to-ink-700"
          >
            View menu
          </button>
        </form>

        <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard
            icon="📱"
            title="Built for mobile"
            description="Fast, lazy-loaded images and a layout customers love browsing on their phones."
          />
          <FeatureCard
            icon="🥗"
            title="Dietary tags"
            description="Highlight vegan, gluten-free, halal and other options at a glance."
          />
          <FeatureCard
            icon="🔗"
            title="Own subdomain"
            description="Get a memorable link like mycafe.menu.com the moment you sign up."
          />
        </div>

        {/* Pricing / CTA section */}
        <div id="pricing" className="mt-20 w-full max-w-5xl scroll-mt-10">
          <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            Pricing
          </span>
          <h2 className="font-display mt-4 text-2xl font-semibold text-ink-900 sm:text-3xl">
            Simple, affordable pricing
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-500">
            Start with a free 7-day trial, then pick the plan that fits your
            business. Cancel anytime.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PLANS.map((plan) => (
              <div
                key={plan.label}
                className={`group relative flex flex-col items-start gap-1 overflow-hidden rounded-2xl border p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.dark
                    ? "border-ink-800 bg-gradient-to-br from-ink-900 to-ink-800 text-white hover:shadow-ink-900/30"
                    : plan.highlight
                    ? "border-brand-300 bg-brand-50 hover:shadow-brand-300/40"
                    : "border-ink-100 bg-white hover:border-brand-300"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute right-3 top-3 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    {plan.highlight}
                  </span>
                )}
                <span
                  className={`font-display text-lg font-semibold ${
                    plan.dark ? "text-white" : "text-ink-900"
                  }`}
                >
                  {plan.label}
                </span>
                <span
                  className={`text-base font-semibold ${
                    plan.dark ? "text-brand-300" : "text-brand-600"
                  }`}
                >
                  {plan.price.toLocaleString()} ETB
                </span>
                <span
                  className={`mt-1 text-xs ${
                    plan.dark ? "text-ink-300" : "text-ink-500"
                  }`}
                >
                  {plan.description}
                </span>
                <div
                  className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 transition group-hover:opacity-100 ${
                    plan.dark ? "bg-brand-500/20" : "bg-brand-200/40"
                  } blur-2xl`}
                />
              </div>
            ))}
          </div>

          <div className="relative mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 px-6 py-10 text-center shadow-lg shadow-brand-600/20 sm:px-12">
            <div className="animate-float-slow pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="animate-float pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h3 className="font-display relative text-2xl font-semibold text-white sm:text-3xl">
              Ready to give your menu a glow-up?
            </h3>
            <p className="relative mx-auto mt-2 max-w-xl text-sm text-brand-50">
              Create your account, build your menu, and start sharing it with
              customers in minutes — your first 7 days are completely free.
            </p>
            <Link
              to="/register"
              className="relative mt-6 inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand-700 shadow transition hover:scale-105 hover:bg-brand-50"
            >
              Create your free menu
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter className="py-4" />
      <InstallPwaPrompt />
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-ink-100 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-brand-100 text-xl transition group-hover:scale-110">
        {icon}
      </span>
      <h3 className="font-display mt-3 text-lg font-semibold text-ink-900">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-ink-500">{description}</p>
    </div>
  );
}
