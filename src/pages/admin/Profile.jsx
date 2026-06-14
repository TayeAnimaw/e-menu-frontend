import { useState } from 'react'
import apiClient from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user, refresh } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    cafe_name: user?.cafe_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    password_confirmation: '',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const fieldError = (field) => errors[field]?.[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('cafe_name', form.cafe_name)
      if (form.email) formData.append('email', form.email)
      if (form.phone) formData.append('phone', form.phone)
      if (form.password) {
        formData.append('password', form.password)
        formData.append('password_confirmation', form.password_confirmation)
      }
      if (avatarFile) formData.append('avatar', avatarFile)

      await apiClient.post('/admin/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      await refresh()
      setForm((prev) => ({ ...prev, password: '', password_confirmation: '' }))
      setSuccess(true)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setErrors({ general: ['Something went wrong. Please try again.'] })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Your profile</h1>
        <p className="mt-1 text-sm text-ink-500">
          Update your account details, cafe name and profile photo.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink-100">
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 px-3 py-2.5 text-sm text-green-700 ring-1 ring-green-200">
            Profile updated successfully.
          </div>
        )}
        {errors.general && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
            {errors.general[0]}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover ring-1 ring-ink-100"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-xl font-semibold text-brand-700">
                {(user?.cafe_name || user?.name || 'E')[0].toUpperCase()}
              </div>
            )}
            <label className="cursor-pointer rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-200">
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700">Your name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {fieldError('name') && <p className="mt-1 text-xs text-red-600">{fieldError('name')}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700">Cafe / restaurant name</label>
            <input
              name="cafe_name"
              required
              value={form.cafe_name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {fieldError('cafe_name') && (
              <p className="mt-1 text-xs text-red-600">{fieldError('cafe_name')}</p>
            )}
            <p className="mt-1 text-xs text-ink-500">
              Your menu link (menufront.ethioserve.com/menu/{user?.subdomain}) stays the same.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="you@example.com"
              />
              {fieldError('email') && <p className="mt-1 text-xs text-red-600">{fieldError('email')}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="+15551234567"
              />
              {fieldError('phone') && <p className="mt-1 text-xs text-red-600">{fieldError('phone')}</p>}
            </div>
          </div>

          <div className="border-t border-ink-100 pt-4">
            <p className="text-sm font-medium text-ink-700">Change password</p>
            <p className="mt-1 text-xs text-ink-500">Leave blank to keep your current password.</p>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="New password"
                />
                {fieldError('password') && (
                  <p className="mt-1 text-xs text-red-600">{fieldError('password')}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
