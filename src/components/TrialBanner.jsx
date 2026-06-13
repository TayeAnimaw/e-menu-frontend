import { Link } from "react-router-dom";

export default function TrialBanner({ user }) {
  if (!user) return null;

  if (user.subscription_status === "expired" || user.trial_expired) {
    return (
      <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-red-50 to-red-100/50 px-4 py-3 text-center text-sm sm:flex-row sm:justify-center">
        <span className="font-medium text-red-700">
          Your trial has expired — menu editing is disabled. Subscribe to keep
          going.
        </span>
        <Link
          to="/admin"
          className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800"
        >
          View plans
        </Link>
      </div>
    );
  }

  if (user.subscription_status === "active" && user.subscription_ends_at) {
    const endsAt = new Date(user.subscription_ends_at);
    const daysLeft = Math.max(
      0,
      Math.ceil((endsAt - new Date()) / (1000 * 60 * 60 * 24))
    );

    if (daysLeft <= 7) {
      return (
        <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/50 px-4 py-3 text-center text-sm sm:flex-row sm:justify-center">
          <span className="font-medium text-amber-700">
            Subscription expires in {daysLeft} day{daysLeft === 1 ? "" : "s"} (
            {endsAt.toLocaleDateString()}).
          </span>
          <Link
            to="/admin"
            className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800"
          >
            Renew plan
          </Link>
        </div>
      );
    }

    return null;
  }

  if (user.subscription_status === "trial" && user.trial_ends_at) {
    const endsAt = new Date(user.trial_ends_at);
    const daysLeft = Math.max(
      0,
      Math.ceil((endsAt - new Date()) / (1000 * 60 * 60 * 24))
    );

    return (
      <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-brand-50 to-brand-100/50 px-4 py-2 text-center text-sm sm:flex-row sm:justify-center">
        <span className="font-medium text-brand-700">
          Free trial — {daysLeft} day{daysLeft === 1 ? "" : "s"} remaining (ends{" "}
          {endsAt.toLocaleDateString()})
        </span>
        <Link
          to="/admin"
          className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800"
        >
          View plans
        </Link>
      </div>
    );
  }

  return null;
}
