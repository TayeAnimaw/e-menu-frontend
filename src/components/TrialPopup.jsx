import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const DISMISS_KEY = 'trial-popup-dismissed-on'

export default function TrialPopup({ user }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!user || user.subscription_status !== 'trial' || !user.trial_ends_at) return

    const today = new Date().toDateString()
    if (sessionStorage.getItem(DISMISS_KEY) === today) return

    setVisible(true)
  }, [user])

  if (!visible || !user?.trial_ends_at) return null

  const endsAt = new Date(user.trial_ends_at)
  const daysLeft = Math.max(0, Math.ceil((endsAt - new Date()) / (1000 * 60 * 60 * 24)))

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, new Date().toDateString())
    setVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl ring-1 ring-ink-100">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Free trial — {daysLeft} day{daysLeft === 1 ? '' : 's'} remaining
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Your trial ends on {endsAt.toLocaleDateString()}. Do you want to purchase a plan to keep
          your menu live afterwards?
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to="/admin"
            onClick={dismiss}
            className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800"
          >
            View plans
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-200"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
