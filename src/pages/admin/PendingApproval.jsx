import { useAuth } from '../../context/AuthContext'

export default function PendingApproval() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-6 text-center">
      <div className="max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink-100">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="font-display text-xl font-semibold text-ink-900">Account pending approval</h1>
        <p className="mt-2 text-sm text-ink-500">
          Thanks for signing up{user?.cafe_name ? `, ${user.cafe_name}` : ''}! Your account is
          currently being reviewed by our team. You&apos;ll be able to manage your menu as soon as
          it&apos;s approved.
        </p>
        {user?.subdomain && (
          <p className="mt-3 text-sm text-ink-500">
            Your reserved subdomain: <span className="font-semibold text-ink-700">{user.subdomain}</span>
          </p>
        )}
        <button
          onClick={logout}
          className="mt-6 rounded-full bg-ink-100 px-5 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-200"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
