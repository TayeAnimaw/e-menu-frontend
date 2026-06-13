import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../../components/Spinner'

export default function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Missing authentication token.')
      return
    }

    loginWithToken(token)
      .then((user) => {
        navigate(user ? '/admin' : '/login', { replace: true })
      })
      .catch(() => {
        setError('Could not complete sign in. Please try again.')
      })
  }, [searchParams, loginWithToken, navigate])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-50 px-6 text-center">
        <div className="max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink-100">
          <h1 className="font-display text-xl font-semibold text-ink-900">Sign in failed</h1>
          <p className="mt-2 text-sm text-ink-500">{error}</p>
          <a
            href="/login"
            className="mt-5 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-700"
          >
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return <PageSpinner />
}
