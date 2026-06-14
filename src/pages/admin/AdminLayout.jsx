import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TrialBanner from "../../components/TrialBanner";
import TrialPopup from "../../components/TrialPopup";
import ProfileMenu from "../../components/ProfileMenu";
import SiteFooter from "../../components/SiteFooter";

const OWNER_NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/menu-items", label: "Menu Items" },
  { to: "/admin/preview", label: "Preview Menu" },
];

const SUPER_ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/analytics", label: "Analytics" },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const NAV_ITEMS = isSuperAdmin ? SUPER_ADMIN_NAV : OWNER_NAV;

  return (
    <div className="bg-menu-pattern-light min-h-screen bg-ink-50 lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 flex-col border-r border-ink-100 bg-white/80 px-4 py-6 backdrop-blur-sm lg:flex">
        <div className="px-2 font-display text-lg font-semibold text-brand-700">
          {isSuperAdmin ? "E-Menu Admin" : (user?.cafe_name || "E-Menu")}
        </div>
        <p className="px-2 text-xs text-ink-500">
          {isSuperAdmin ? "Super Admin" : `menufront.ethioserve.com/menu/${user?.subdomain}`}
        </p>

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
            <p className="text-xs text-ink-500">menufront.ethioserve.com/menu/{user?.subdomain}</p>
          </div>
          <div className="hidden lg:block" />
          <ProfileMenu user={user} />
        </header>

        <TrialBanner user={user} />
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
