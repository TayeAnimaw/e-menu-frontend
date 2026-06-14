import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { PageSpinner } from "../../components/Spinner";
import { publicMenuUrl } from "../../config";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState("");
  const [payError, setPayError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { refresh: refreshUser } = useAuth();
  const toastRef = useRef(null);

  const paymentResult = searchParams.get("payment");

  useEffect(() => {
    if (paymentResult) {
      // Refresh user data after returning from Chapa
      refreshUser?.();
      // Clean the query param from the URL without a re-render loop
      const timer = setTimeout(() => {
        setSearchParams({}, { replace: true });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [paymentResult]); // eslint-disable-line

  useEffect(() => {
    apiClient
      .get("/admin/dashboard")
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async (plan) => {
    setPayLoading(plan);
    setPayError("");
    try {
      const { data } = await apiClient.post("/admin/subscription/pay", {
        plan,
      });
      const url = data?.checkout_url;
      if (url && url.startsWith("https://")) {
        window.location.href = url;
      } else {
        setPayError(
          "Payment gateway returned an invalid URL. Please try again or contact support."
        );
        setPayLoading("");
      }
    } catch (err) {
      setPayError(
        err.response?.data?.message || "Could not start payment. Try again."
      );
      setPayLoading("");
    }
  };

  if (loading) return <PageSpinner />;
  if (!data) return null;

  const { user, categories_count, menu_items_count, last_payment } = data;
  const public_menu_url = publicMenuUrl(user.subdomain);
  const isActive = user.subscription_status === "active";
  const isExpired =
    user.subscription_status === "expired" || user.trial_expired;
  const isTrial = user.subscription_status === "trial";

  const subscriptionEndsAt = user.subscription_ends_at
    ? new Date(user.subscription_ends_at)
    : null;

  const trialEndsAt = user.trial_ends_at ? new Date(user.trial_ends_at) : null;

  const paidAt = last_payment?.paid_at ? new Date(last_payment.paid_at) : null;
  const fmt = (d) => d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="space-y-6">
      {/* Payment result toast */}
      {paymentResult === "success" && (
        <div
          ref={toastRef}
          className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 ring-1 ring-green-200"
        >
          Payment successful! Your subscription is now active.
        </div>
      )}
      {paymentResult === "failed" && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
          Payment was not completed. You can try again below.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink-100 sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          Welcome back{user.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Here's what's happening with {user.cafe_name || "your menu"} today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Categories"
          value={categories_count}
          accent="brand"
          icon="folder"
        />
        <StatCard
          label="Menu items"
          value={menu_items_count}
          accent="emerald"
          icon="dish"
        />
        <StatCard
          label="Subscription"
          value={user.subscription_status}
          valueClassName="capitalize"
          accent="sky"
          icon="badge"
        />
      </div>

      {/* Public menu + trial info */}
      <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-ink-100">
        <h2 className="font-display text-base font-semibold text-ink-900">
          Your public menu
        </h2>
        <p className="mt-1 break-all text-sm text-brand-600">
          <a
            href={public_menu_url}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {public_menu_url}
          </a>
        </p>

        {isTrial && trialEndsAt && (
          <p className="mt-3 text-sm text-ink-500">
            Trial ends on{" "}
            <span className="font-medium text-ink-700">{fmt(trialEndsAt)}</span>
          </p>
        )}
        {isActive && subscriptionEndsAt && user.subscription_plan !== "lifetime" && (
          <p className="mt-3 text-sm text-ink-500">
            Active until{" "}
            <span className="font-medium text-ink-700">{fmt(subscriptionEndsAt)}</span>
          </p>
        )}
        {isActive && user.subscription_plan === "lifetime" && (
          <p className="mt-3 text-sm text-ink-500">
            <span className="font-medium text-ink-700">Lifetime plan</span> — never expires
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/admin/categories"
            className="rounded-full bg-linear-to-br from-brand-600 to-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800"
          >
            Manage categories
          </Link>
          <Link
            to="/admin/menu-items"
            className="rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-200"
          >
            Manage menu items
          </Link>
          <Link
            to="/admin/preview"
            className="rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-200"
          >
            Preview menu
          </Link>
        </div>
      </div>

      {/* Subscription / payment card */}
      <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-ink-100">
        <h2 className="font-display text-base font-semibold text-ink-900">
          Subscription
        </h2>

        {/* Status summary block */}
        {isActive && (
          <div className="mt-3 rounded-xl bg-green-50 px-4 py-3 ring-1 ring-green-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white capitalize">
                {user.subscription_plan || "active"}
              </span>
              <span className="text-sm font-medium text-green-800">
                Subscription active
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {paidAt && (
                <p className="text-sm text-green-700">
                  <span className="text-green-500">Paid on </span>
                  <span className="font-semibold">{fmt(paidAt)}</span>
                  {last_payment?.amount && (
                    <span className="ml-1 text-green-600">
                      · ETB {last_payment.amount.toLocaleString()}
                    </span>
                  )}
                </p>
              )}
              {subscriptionEndsAt && user.subscription_plan !== "lifetime" && (
                <p className="text-sm text-green-700">
                  <span className="text-green-500">Active until </span>
                  <span className="font-semibold">{fmt(subscriptionEndsAt)}</span>
                  <span className="ml-1 text-green-600">
                    · {Math.max(0, Math.ceil((subscriptionEndsAt - new Date()) / 86400000))}d left
                  </span>
                </p>
              )}
              {user.subscription_plan === "lifetime" && (
                <p className="text-sm text-green-700">
                  <span className="text-green-500">Valid </span>
                  <span className="font-semibold">forever — lifetime plan</span>
                </p>
              )}
            </div>
          </div>
        )}

        {isTrial && (
          <div className="mt-3 rounded-xl bg-brand-50 px-4 py-3 ring-1 ring-brand-200">
            <p className="text-sm font-medium text-brand-800">
              Free trial
              {trialEndsAt && (
                <>
                  {" "}· ends <span className="font-semibold">{fmt(trialEndsAt)}</span>
                  {" "}({Math.max(0, Math.ceil((trialEndsAt - new Date()) / 86400000))}d left)
                </>
              )}
            </p>
            <p className="mt-0.5 text-xs text-brand-600">
              Subscribe below to keep your menu active after the trial ends.
            </p>
          </div>
        )}

        {isExpired && (
          <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
            <p className="text-sm font-medium text-red-700">
              Trial expired — subscribe to re-enable menu editing.
            </p>
          </div>
        )}

        {/* Payment plans — hide only for lifetime active users */}
        {!(user.subscription_plan === "lifetime" && isActive) && (
          <>
            <p className="mt-4 mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
              {isActive ? "Extend or upgrade" : "Choose a plan"}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {PLANS.map((plan) => (
                <button
                  key={plan.key}
                  onClick={() => handlePay(plan.key)}
                  disabled={!!payLoading}
                  className="flex flex-col items-start gap-1 rounded-2xl border border-ink-100 bg-ink-50 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-60"
                >
                  {plan.highlight && (
                    <span className="rounded-full bg-linear-to-br from-brand-600 to-brand-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                      {plan.highlight}
                    </span>
                  )}
                  <span className="font-display text-lg font-semibold text-ink-900">
                    {plan.label}
                  </span>
                  <span className="text-sm font-medium text-brand-600">
                    {plan.price.toLocaleString()} ETB
                  </span>
                  <span className="mt-1 text-xs text-ink-500">
                    {payLoading === plan.key
                      ? "Redirecting to Payment…"
                      : plan.description}
                  </span>
                </button>
              ))}
            </div>
            {payError && (
              <p className="mt-3 text-sm text-red-600">{payError}</p>
            )}
          </>
        )}

        <p className="mt-4 text-xs text-ink-500">
          Secure payment · Ethiopian payment gateway · Your menu stays live until subscription ends.
        </p>
      </div>
    </div>
  );
}

const PLANS = [
  {
    key: "monthly",
    label: "1 Month",
    price: 1000,
    description: "Billed once, 30 days",
  },
  {
    key: "quarterly",
    label: "3 Months",
    price: 2500,
    description: "Billed once, 90 days",
  },
  {
    key: "semiannual",
    label: "6 Months",
    price: 5000,
    description: "Billed once, 180 days",
  },
  {
    key: "annual",
    label: "1 Year",
    price: 10000,
    description: "Billed once, 365 days",
    highlight: "Best value",
  },
  {
    key: "lifetime",
    label: "Lifetime",
    price: 17000,
    description: "One-time, never expires",
  },
];

const ACCENT_STYLES = {
  brand: "bg-linear-to-br from-brand-50 to-brand-100 text-brand-700",
  emerald: "bg-linear-to-br from-emerald-50 to-emerald-100 text-emerald-700",
  sky: "bg-linear-to-br from-sky-50 to-sky-100 text-sky-700",
};

const ICONS = {
  folder: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7a2 2 0 0 1 2-2h3.5l1.5 2H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
    />
  ),
  dish: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 13a8 8 0 0 1 16 0M4 13h16M4 13a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1M12 6V4"
    />
  ),
  badge: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-3.5 1.5L7 22l5-2.5L17 22l-1.5-5.5"
    />
  ),
};

function StatCard({
  label,
  value,
  valueClassName = "",
  accent = "brand",
  icon,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-100 transition hover:shadow-md">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ACCENT_STYLES[accent]}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {ICONS[icon]}
        </svg>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
          {label}
        </p>
        <p
          className={`font-display mt-0.5 text-2xl font-semibold text-ink-900 ${valueClassName}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
