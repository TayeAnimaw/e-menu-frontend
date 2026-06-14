import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TrialPopup from "../../components/TrialPopup";
import ProfileMenu from "../../components/ProfileMenu";
import SiteFooter from "../../components/SiteFooter";
import { publicMenuUrl } from "../../config";

function TrialChip({ user }) {
  if (!user) return null;

  if (user.subscription_status === "expired" || user.trial_expired) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700">
          Trial expired
        </span>
        <Link
          to="/admin"
          className="rounded-full bg-linear-to-br from-brand-600 to-brand-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-brand-700 hover:to-brand-800"
        >
          Subscribe
        </Link>
      </div>
    );
  }

  if (user.subscription_status === "trial" && user.trial_ends_at) {
    const endsAt = new Date(user.trial_ends_at);
    const daysLeft = Math.max(0, Math.ceil((endsAt - new Date()) / (1000 * 60 * 60 * 24)));
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
          Free trial · {daysLeft}d left
        </span>
        <Link
          to="/admin"
          className="rounded-full bg-linear-to-br from-brand-600 to-brand-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-brand-700 hover:to-brand-800"
        >
          View plans
        </Link>
      </div>
    );
  }

  if (user.subscription_status === "active" && user.subscription_ends_at) {
    const endsAt = new Date(user.subscription_ends_at);
    const daysLeft = Math.max(0, Math.ceil((endsAt - new Date()) / (1000 * 60 * 60 * 24)));
    if (daysLeft <= 7) {
      return (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 ring-1 ring-amber-200">
            Expires in {daysLeft}d
          </span>
          <Link
            to="/admin"
            className="rounded-full bg-linear-to-br from-brand-600 to-brand-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-brand-700 hover:to-brand-800"
          >
            Renew
          </Link>
        </div>
      );
    }
  }

  return null;
}

const OWNER_NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/menu-items", label: "Menu Items" },
  { to: "/admin/preview", label: "Preview Menu" },
];

const SUPER_ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", end: true },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const NAV_ITEMS = isSuperAdmin ? SUPER_ADMIN_NAV : OWNER_NAV;

  return (
    <div className="bg-menu-pattern-light min-h-screen bg-ink-50 lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 flex-col border-r border-ink-100 bg-white/80 px-4 py-6 backdrop-blur-sm lg:flex">
        {isSuperAdmin ? (
          <div className="px-2">
            <div className="font-display text-lg font-semibold text-brand-700">E-Menu Admin</div>
            <p className="text-xs text-ink-400">Super Admin</p>
          </div>
        ) : (
          <div className="px-2">
            {/* Cafe logo + name */}
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.cafe_name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-brand-100"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-700 ring-2 ring-brand-100">
                  <span className="text-sm font-bold text-white">
                    {(user?.cafe_name || user?.name || 'E')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <div className="font-display text-base font-semibold leading-tight text-brand-700 truncate">
                  {user?.cafe_name || "My Cafe"}
                </div>
                <span className="text-xs text-ink-400">Menu owner</span>
              </div>
            </div>
            {/* Clickable public menu link */}
            {user?.subdomain && (
              <a
                href={publicMenuUrl(user.subdomain)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 hover:underline truncate"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 shrink-0">
                  <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z"/>
                  <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z"/>
                </svg>
                <span className="truncate">{publicMenuUrl(user.subdomain)}</span>
              </a>
            )}
          </div>
        )}

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-br from-brand-50 to-brand-100 text-brand-700"
                    : "text-ink-600 hover:bg-ink-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-ink-100 bg-white/80 px-4 py-3.5 backdrop-blur-sm sm:px-6">
          <div className="lg:hidden">
            <div className="font-display text-base font-semibold text-brand-700">
              {user?.cafe_name || "E-Menu"}
            </div>
            <p className="text-xs text-ink-500 truncate">{user?.subdomain ? publicMenuUrl(user.subdomain) : ''}</p>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {!isSuperAdmin && <TrialChip user={user} />}
            <ProfileMenu user={user} />
          </div>
        </header>

        <TrialPopup user={user} />

        <main className="flex-1 px-4 py-5 pb-20 sm:px-6 lg:pb-5">
          <Outlet />
        </main>

        <SiteFooter className="pt-4 pb-20 lg:pb-4" />

        {/* Bottom nav (mobile) */}
        <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-ink-100 bg-white/80 py-2 backdrop-blur-sm lg:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isActive ? "text-brand-700" : "text-ink-500"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
