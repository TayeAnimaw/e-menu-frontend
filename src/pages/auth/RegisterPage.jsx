import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import AuthLayout from "../../components/AuthLayout"
import SocialLoginButtons from "../../components/SocialLoginButtons"

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-ink-200 bg-ink-50/60 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"

const brandingExtra = (
  <ul className="space-y-2.5">
    {[
      "Unlimited categories & menu items",
      "Your own shareable menu link",
      "Photos, prices & dietary tags",
      "Cancel anytime — from 1,000 ETB/mo",
    ].map((text) => (
      <li key={text} className="flex items-center gap-2.5 text-sm text-white/65">
        <CheckIcon />
        {text}
      </li>
    ))}
  </ul>
)

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    cafe_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)
    try {
      const payload = { ...form }
      if (!payload.email) delete payload.email
      if (!payload.phone) delete payload.phone
      await register(payload)
      navigate("/admin")
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setErrors({ general: ["Something went wrong. Please try again."] })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const fieldError = (field) => errors[field]?.[0]

  return (
    <AuthLayout
      title="Start your free trial"
      subtitle="7 days free · No credit card · No approval needed"
      brandingExtra={brandingExtra}
    >
      {errors.general && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {errors.general[0]}
        </div>
      )}

      <div className="mb-5 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 px-4 py-2.5 text-center text-xs font-semibold text-brand-700">
        🎉 7 days free, then from just 1,000 ETB — cancel anytime
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name + Cafe side-by-side on sm+ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink-700">Your name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputCls}
              placeholder="Jane Doe"
            />
            {fieldError("name") && <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700">Cafe / restaurant name</label>
            <input
              name="cafe_name"
              required
              value={form.cafe_name}
              onChange={handleChange}
              className={inputCls}
              placeholder="My Downtown Cafe"
            />
            {fieldError("cafe_name") && <p className="mt-1 text-xs text-red-600">{fieldError("cafe_name")}</p>}
          </div>
        </div>

        {/* Email + Phone side-by-side on sm+ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputCls}
              placeholder="you@example.com"
            />
            {fieldError("email") && <p className="mt-1 text-xs text-red-600">{fieldError("email")}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputCls}
              placeholder="+251911…"
            />
            {fieldError("phone") && <p className="mt-1 text-xs text-red-600">{fieldError("phone")}</p>}
          </div>
        </div>
        <p className="-mt-2 text-xs text-ink-400">Provide at least one of email or phone.</p>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-ink-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className={`${inputCls} pr-11`}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.75 text-ink-400 transition hover:text-ink-600"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {fieldError("password") && <p className="mt-1 text-xs text-red-600">{fieldError("password")}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-ink-700">Confirm password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="password_confirmation"
              required
              value={form.password_confirmation}
              onChange={handleChange}
              className={`${inputCls} pr-11`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.75 text-ink-400 transition hover:text-ink-600"
              tabIndex={-1}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800 hover:shadow-lg hover:shadow-brand-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account…
            </span>
          ) : (
            "Start my free trial →"
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
        <div className="h-px flex-1 bg-ink-100" />
        <span>or continue with</span>
        <div className="h-px flex-1 bg-ink-100" />
      </div>

      <SocialLoginButtons />

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
