import { useEffect, useState } from "react";
import apiClient from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { PageSpinner } from "../../components/Spinner";
import LazyImage from "../../components/LazyImage";
import DietaryTagBadge from "../../components/DietaryTagBadge";
import { DIETARY_TAG_PRESETS } from "../../config";

const emptyForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  tags: [],
  is_available: true,
  sort_order: 0,
};

export default function MenuItems() {
  const { user } = useAuth();
  const canEdit = user?.can_manage_menu;

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  const load = () => {
    setLoading(true);
    Promise.all([
      apiClient.get("/admin/menu-items"),
      apiClient.get("/admin/categories"),
    ])
      .then(([itemsRes, categoriesRes]) => {
        setItems(itemsRes.data.data);
        setCategories(categoriesRes.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setError("");
  };

  const toggleTag = (tag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("category_id", form.category_id);
      payload.append("name", form.name);
      payload.append("description", form.description || "");
      payload.append("price", form.price);
      payload.append("is_available", form.is_available ? "1" : "0");
      payload.append("sort_order", form.sort_order);
      form.tags.forEach((tag) => payload.append("tags[]", tag));
      if (imageFile) payload.append("image", imageFile);

      if (editingId) {
        await apiClient.post(`/admin/menu-items/${editingId}`, payload);
      } else {
        await apiClient.post("/admin/menu-items", payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save menu item.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      category_id: item.category_id,
      name: item.name,
      description: item.description || "",
      price: item.price,
      tags: item.tags || [],
      is_available: item.is_available,
      sort_order: item.sort_order,
    });
    setImageFile(null);
    setError("");
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    await apiClient.delete(`/admin/menu-items/${item.id}`);
    if (editingId === item.id) resetForm();
    load();
  };

  if (loading) return <PageSpinner />;

  const categoryName = (id) =>
    categories.find((c) => c.id === id)?.name || "Uncategorized";
  const visibleItems =
    filterCategory === "all"
      ? items
      : items.filter((i) => i.category_id === Number(filterCategory));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Menu Items
        </h1>
        <p className="text-sm text-ink-500">
          Add dishes and drinks, set prices, tags and availability.
        </p>
      </div>

      {!canEdit && (
        <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-700 ring-1 ring-amber-200">
          Your trial has ended — menu items are read-only.
        </div>
      )}

      {categories.length === 0 && (
        <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-700 ring-1 ring-amber-200">
          Create a category first before adding menu items.
        </div>
      )}

      {canEdit && categories.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-ink-100"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700">
                Category
              </label>
              <select
                required
                value={form.category_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category_id: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700">
                Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Margherita Pizza"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={2}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Short description of the dish"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-ink-700">
                Price (ETB)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700">
                Sort order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                }
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700">
                Image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="mt-1 w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700">
              Dietary tags
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DIETARY_TAG_PRESETS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
                    form.tags.includes(tag)
                      ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/25"
                      : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_available: e.target.checked }))
              }
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Available
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:from-brand-700 hover:to-brand-800 disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add menu item"}
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

      {items.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-ink-500">Filter:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-900 shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.length === 0 && (
          <p className="col-span-full rounded-2xl bg-white p-6 text-center text-sm text-ink-500 shadow-lg ring-1 ring-ink-100">
            No menu items yet.
          </p>
        )}

        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-100 transition hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-50">
              <LazyImage
                src={item.image_url}
                alt={item.name}
                className="h-full w-full transition-transform duration-500 hover:scale-105"
              />
              {!item.is_available && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-900/60 to-ink-800/60 backdrop-blur-sm">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-800 shadow">
                    Unavailable
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-ink-900">{item.name}</h3>
                <span className="whitespace-nowrap rounded-full bg-gradient-to-br from-brand-50 to-brand-100 px-2.5 py-1 text-sm font-bold text-brand-700 shadow-sm">
                  {Number(item.price).toFixed(2)} ETB
                </span>
              </div>
              <p className="text-xs text-ink-500">
                {categoryName(item.category_id)}
              </p>
              {item.description && (
                <p className="line-clamp-2 text-sm text-ink-500">
                  {item.description}
                </p>
              )}
              {item.tags?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <DietaryTagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
              {canEdit && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-full bg-ink-100 px-3.5 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-ink-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
