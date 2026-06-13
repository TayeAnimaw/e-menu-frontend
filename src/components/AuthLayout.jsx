import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  children,
  brandingExtra,
}) {
  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Branding panel */}
      <div className="bg-menu-pattern-light relative hidden w-1/2 flex-col justify-between border-r border-ink-100 bg-white p-10 text-ink-900 lg:flex">
        <div>
          <Link
            to="/"
            className="font-display text-2xl font-semibold tracking-tight text-ink-900"
          >
            E-Menu
          </Link>
        </div>

        <div className="max-w-md">
          <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            Digital menus, done beautifully
          </span>
          <h2 className="font-display mt-4 text-4xl font-semibold leading-tight text-ink-900">
            Beautiful digital menus for cafes, restaurants & hotels
          </h2>
          <p className="mt-4 text-base text-ink-600">
            Manage your categories, dishes, photos and dietary tags from one
            simple dashboard — sign up and get instant access with a free 7-day
            trial, no approval needed.
          </p>
          {brandingExtra}
        </div>

        <p className="text-xs text-ink-500">
          © {new Date().getFullYear()} E-Menu. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="font-display mb-6 block text-center text-xl font-semibold text-brand-700 lg:hidden"
          >
            E-Menu
          </Link>
          <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-ink-100 sm:p-10">
            <h1 className="font-display text-center text-2xl font-semibold text-ink-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-center text-sm text-ink-500">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
