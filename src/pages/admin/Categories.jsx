import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../../components/Spinner'

const emptyForm = { name: '', sort_order: 0 }

export default function Categories() {
  const { user } = useAuth()
  const canEdit = user?.can_manage_menu

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    apiClient
      .get('/admin/categories')
      .then(({ data }) => setCategories(data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingId) {
        await apiClient.put(`/admin/categories/${editingId}`, form)
      } else {
        await apiClient.post('/admin/categories', form)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setForm({ name: category.name, sort_order: category.sort_order })
    setError('')
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"? This will also delete its items.`)) {
      return
    }

    await apiClient.delete(`/admin/categories/${category.id}`)
    if (editingId === category.id) resetForm()
    load()
  }

  if (loading) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Categories</h1>
        <p className="text-sm text-ink-500">Organize your menu into sections like Starters, Mains, Drinks.</p>
      </div>

      {!canEdit && (
        <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-700 ring-1 ring-amber-200">
          Your trial has ended — categories are read-only.
        </div>
      )}

      {canEdit && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-ink-100 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-ink-700">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Starters"
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="block text-sm font-medium text-ink-700">Sort order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800 disabled:opacity-60"
            >
              {editingId ? 'Save changes' : 'Add category'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full bg-ink-100 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {error && <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}

      <div className="space-y-3">
        {categories.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-ink-500 shadow-lg ring-1 ring-ink-100">
            No categories yet. Add one above to get started.
          </p>
        )}

        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-100 transition hover:shadow-md"
          >
            <div>
              <p className="font-semibold text-ink-900">{category.name}</p>
              <p className="text-xs text-ink-500">
                {category.items?.length ?? 0} item{(category.items?.length ?? 0) === 1 ? '' : 's'} · sort {category.sort_order}
              </p>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="rounded-full bg-ink-100 px-3.5 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-ink-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
