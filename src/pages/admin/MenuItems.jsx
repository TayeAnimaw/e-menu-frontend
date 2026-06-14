import { useEffect, useRef, useState } from "react";
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
  const [imagePreview, setImagePreview] = useState(null);
  const [editingImageUrl, setEditingImageUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const formRef = useRef(null);

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
    setImagePreview(null);
    setEditingImageUrl(null);
    setRemoveImage(false);
    setEditingId(null);
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const clearSelectedFile = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleRemoveExistingImage = () => {
    setEditingImageUrl(null);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
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
      if (imageFile) {
        payload.append("image", imageFile);
      } else if (removeImage) {
        payload.append("remove_image", "1");
      }

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
    setImagePreview(null);
    setEditingImageUrl(item.image_url || null);
    setRemoveImage(false);
    setError("");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleDeleteClick = (item) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await apiClient.delete(`/admin/menu-items/${deleteTarget.id}`);
      if (editingId === deleteTarget.id) resetForm();
      load();
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
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
          ref={formRef}
          onSubmit={handleSubmit}
          className={`space-y-4 rounded-2xl bg-white p-4 shadow-lg ring-1 transition-all ${
            editingId ? "ring-brand-400 shadow-brand-100" : "ring-ink-100"
          }`}
        >
          {editingId && (
            <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 ring-1 ring-brand-200">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
              Editing menu item — make your changes and click Save
            </div>
          )}
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

              {/* Preview: newly selected file */}
              {imagePreview && (
                <div className="mt-2 flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-xl object-cover ring-1 ring-ink-200"
                    />
                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                      title="Remove selected file"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    New image selected.<br />Click × to cancel.
                  </p>
                </div>
              )}

              {/* Preview: existing image when editing (no new file chosen) */}
              {!imagePreview && editingImageUrl && (
                <div className="mt-2 flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={editingImageUrl}
                      alt="Current"
                      className="h-20 w-20 rounded-xl object-cover ring-1 ring-ink-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveExistingImage}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    Current image.<br />Click × to remove, or pick a new file below.
                  </p>
                </div>
              )}

              {/* File input — hidden once a new file is staged */}
              {!imagePreview && (
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="mt-2 w-full text-sm"
                />
              )}
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
                    onClick={() => handleDeleteClick(item)}
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

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-ink-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="font-display mt-4 text-lg font-semibold text-ink-900">
              Delete menu item?
            </h3>
            <p className="mt-2 text-sm text-ink-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-ink-800">
                &ldquo;{deleteTarget.name}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                className="flex-1 rounded-full bg-ink-100 px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-200 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
